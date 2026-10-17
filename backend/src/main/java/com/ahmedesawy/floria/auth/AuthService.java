package com.ahmedesawy.floria.auth;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ahmedesawy.floria.auth.dto.request.LoginRequest;
import com.ahmedesawy.floria.auth.dto.request.SignupRequest;
import com.ahmedesawy.floria.auth.dto.request.UpdateProfileRequest;
import com.ahmedesawy.floria.auth.dto.response.LoginResponse;
import com.ahmedesawy.floria.auth.signupVerify.SignupVerificationService;
import com.ahmedesawy.floria.common.exception.NotFoundException;
import com.ahmedesawy.floria.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.floria.common.exception.UnauthorizedException;
import com.ahmedesawy.floria.common.storage.FileStorageService;
import com.ahmedesawy.floria.role.Permission;
import com.ahmedesawy.floria.user.Account;
import com.ahmedesawy.floria.user.AuthProvider;
import com.ahmedesawy.floria.user.UserResponse;
import com.ahmedesawy.floria.user.customer.Customer;
import com.ahmedesawy.floria.user.customer.CustomerMapper;
import com.ahmedesawy.floria.user.customer.CustomerRepository;
import com.ahmedesawy.floria.user.employee.Employee;
import com.ahmedesawy.floria.user.employee.EmployeeMapper;
import com.ahmedesawy.floria.user.employee.EmployeeRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final FileStorageService fileStorageService;

    private final PasswordEncoder encoder;

    private final TokenBlacklistService tokenBlacklistService;
    private final SignupVerificationService signupVerificationService;
    private final RefreshTokenService refreshTokenService;

    // ---- Durations ----------------------------------------------------
    private static final Duration CUSTOMER_SESSION = Duration.ofHours(24);
    private static final Duration EMPLOYEE_SESSION = Duration.ofHours(1);

    // ---- SIGN UP ---------------------------------------------------
    public void signup(SignupRequest req) {

        String email = req.getEmail().trim();

        if (employeeRepository.existsByEmail(email))
            throw new ResourceAlreadyExistsException("Email already exist!");

        Optional<Customer> existing = customerRepository.findByEmail(email);

        if (existing.isPresent()) {
            Customer user = existing.get();

            // Verified | Google Login : real conflict
            if (user.isEmailVerified() || user.getProvider() != AuthProvider.LOCAL)
                throw new ResourceAlreadyExistsException("Email already exist!");

            user.setUserName(req.getUserName());
            user.setPassword(encoder.encode(req.getPassword()));
            customerRepository.save(user);

            signupVerificationService.resend(email);
            return;
        }

        if (employeeRepository.existsByEmail(req.getEmail()) || customerRepository.existsByEmail(req.getEmail()))
            throw new ResourceAlreadyExistsException("Email already exist!");

        Customer user = new Customer();
        user.setUserName(req.getUserName());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setProvider(AuthProvider.LOCAL);

        customerRepository.save(user);

        signupVerificationService.sendVerificationCode(user.getEmail(), AccountIdentity.AccountType.CUSTOMER);

    }

    // ---- LOGIN -----------------------------
    public LoginResponse login(LoginRequest req) {

        Customer customerCheck = customerRepository.findByEmail(req.getEmail()).orElse(null);
        if (customerCheck != null && customerCheck.getProvider() != AuthProvider.LOCAL) {
            throw new BadCredentialsException("This account uses Google sign-in. Please continue with Google.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(),
                        req.getPassword()));

        if (!authentication.isAuthenticated())
            throw new BadCredentialsException("Login failed");

        Object principal = authentication.getPrincipal();

        UUID accountId;
        AccountIdentity.AccountType accountType;
        Map<String, Object> claims;
        Duration sessionDuration;
        String principalEmail;

        if (principal instanceof EmployeePrincipal employeePrincipal) {
            if (!employeePrincipal.isEmailVerified()) {
                throw new DisabledException("Please verify your email before logging in");
            }

            accountId = employeePrincipal.getId();
            accountType = AccountIdentity.AccountType.EMPLOYEE;
            sessionDuration = EMPLOYEE_SESSION;
            claims = buildClaims(employeePrincipal.getId(), employeePrincipal.getRoleName());
            principalEmail = employeePrincipal.getEmail();

        } else if (principal instanceof CustomerPrincipal customerPrincipal) {

            if (!customerPrincipal.isEmailVerified()) {
                throw new DisabledException("Please verify your email before logging in");
            }

            accountId = customerPrincipal.getId();
            accountType = AccountIdentity.AccountType.CUSTOMER;
            sessionDuration = CUSTOMER_SESSION;
            claims = buildClaims(customerPrincipal.getId(), "CUSTOMER");
            principalEmail = customerPrincipal.getEmail();

        } else {
            throw new IllegalStateException("Unknown principal type: " + principal.getClass());
        }

        String accessToken = jwtService.generateToken(principalEmail, claims, sessionDuration.toMillis());
        String refreshToken = req.isRememberMe()
                ? refreshTokenService.create(accountId, accountType)
                : null;

        return new LoginResponse(accessToken, refreshToken);

    }

    // ---- REFRESH ------------------
    public LoginResponse refreshAccessToken(String refreshTokenValue) {
        RefreshTokenService.RefreshTokenData data = refreshTokenService.validate(refreshTokenValue);

        String email;
        Duration sessionDuration;
        Map<String, Object> claims;

        switch (data.type()) {
            case CUSTOMER -> {
                Customer customer = customerRepository.findByIdOrThrow(data.accountId());
                if (!customer.isEmailVerified()) {
                    throw new DisabledException("Account is not active");
                }
                email = customer.getEmail();
                claims = buildClaims(customer.getId(), "CUSTOMER");
                sessionDuration = CUSTOMER_SESSION;
            }
            case EMPLOYEE -> {
                Employee employee = employeeRepository.findByIdOrThrow(data.accountId());
                email = employee.getEmail();
                claims = buildClaims(employee.getId(), employee.getRole().getCode());
                sessionDuration = EMPLOYEE_SESSION;
            }
            default -> throw new IllegalStateException("Unknown account type");
        }

        String newRefreshToken = refreshTokenService.create(data.accountId(), data.type());
        String newAccessToken = jwtService.generateToken(email, claims, sessionDuration.toMillis());

        return new LoginResponse(newAccessToken, newRefreshToken);
    }

    // ---- ME ----------------------------------------------------
    public UserResponse getAuthenticatedUser(Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedException("Unauthorized");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof EmployeePrincipal employeePrincipal) {
            Employee employee = employeeRepository.findByEmail(employeePrincipal.getEmail())
                    .orElseThrow(() -> new NotFoundException("Employee not found"));
            return EmployeeMapper.toEmployeeResponse(employee);

        } else if (principal instanceof CustomerPrincipal customerPrincipal) {
            Customer customer = customerRepository.findByEmail(customerPrincipal.getEmail())
                    .orElseThrow(() -> new NotFoundException("Customer not found"));
            return CustomerMapper.toResponse(customer);
        } else {
            throw new IllegalStateException("Unknown principal type: " + principal.getClass());
        }
    }

    public boolean dashboardAccess(Authentication authentication) {
        if (authentication == null)
            return false;

        return authentication.getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().equals(Permission.VIEW_DASHBOARD.getPermission()));
    }

    // ---- UPDATE PROFILE ------------------------------
    @Transactional
    public void updateProfile(UpdateProfileRequest request,
            AccountIdentity identity) {

        Account account = switch (identity.type()) {
            case CUSTOMER -> customerRepository.findByIdOrThrow(identity.id());
            case EMPLOYEE -> employeeRepository.findByIdOrThrow(identity.id());
        };

        account.setUserName(request.getUserName().trim());
        MultipartFile image = request.getImage();

        if (image != null && !image.isEmpty()) {
            String oldImageUrl = account.getImageUrl();

            String newImageUrl = fileStorageService.uploadImage(image, "users");
            account.setImageUrl(newImageUrl);

            if (oldImageUrl != null && !isExternalAvatar(oldImageUrl)) {
                fileStorageService.deleteFile(oldImageUrl);
            }
        }

    }

    private static boolean isExternalAvatar(String imageUrl) {
        return imageUrl.startsWith("https://") || imageUrl.startsWith("http://");
    }

    // ---- LOG OUT ---------------------------------------------------------------
    public void logout(HttpServletRequest request, String refreshToken) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                long remainingMillis = jwtService.getRemainingExpiryMillis(token);
                if (remainingMillis > 0) {
                    tokenBlacklistService.blacklist(token, remainingMillis);
                }
            } catch (Exception ex) {
            }
        }

        // The refresh token now comes from the request body
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revoke(refreshToken);
        }
    }

    // ---- HELPERS ----------------------------------------------------------
    private Map<String, Object> buildClaims(UUID id, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("role", role);
        return claims;
    }

}