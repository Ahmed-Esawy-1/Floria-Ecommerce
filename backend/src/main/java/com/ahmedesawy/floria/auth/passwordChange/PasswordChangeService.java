package com.ahmedesawy.floria.auth.passwordChange;

import java.time.Duration;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ahmedesawy.floria.auth.AccountIdentity;
import com.ahmedesawy.floria.auth.AuthService;
import com.ahmedesawy.floria.common.exception.BadRequestException;
import com.ahmedesawy.floria.common.mail.BrevoMailService;
import com.ahmedesawy.floria.common.util.CodeGenerator;
import com.ahmedesawy.floria.user.Account;
import com.ahmedesawy.floria.user.AuthProvider;
import com.ahmedesawy.floria.user.customer.Customer;
import com.ahmedesawy.floria.user.customer.CustomerRepository;
import com.ahmedesawy.floria.user.employee.Employee;
import com.ahmedesawy.floria.user.employee.EmployeeRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.json.JsonMapper;

@Service
@RequiredArgsConstructor
public class PasswordChangeService {

    private static final Duration CODE_TTL = Duration.ofMinutes(2);
    private static final int MAX_ATTEMPTS = 5;

    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;
    private final JsonMapper jsonMapper;
    private final BrevoMailService brevoMailService;
    private final AuthService authService;

    public void requestPasswordChange(ChangePasswordRequest request, AccountIdentity identity) {
        Account account = loadLocalAccount(identity);

        if (!passwordEncoder.matches(request.getOldPassword(), account.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        String code = CodeGenerator.generate(6);

        PendingPasswordChange pending = new PendingPasswordChange(
                identity.id(),
                identity.type(),
                passwordEncoder.encode(request.getNewPassword()));

        try {
            redisTemplate.opsForValue().set(
                    redisKey(identity),
                    jsonMapper.writeValueAsString(pending),
                    CODE_TTL);
        } catch (JacksonException e) {
            throw new IllegalStateException("Failed to serialize pending password change", e);
        }

        redisTemplate.opsForValue().set(codeKey(identity), code, CODE_TTL);
        redisTemplate.delete(attemptsKey(identity)); // reset attempts on a new request

        try {
            sendVerificationEmail(identity.email(), code);
        } catch (RuntimeException e) {
            clearPending(identity);
            throw new IllegalStateException("Failed to send verification email", e);
        }
    }

    public void confirmPasswordChange(String code, AccountIdentity identity, HttpServletRequest request) {
        Account account = loadLocalAccount(identity);

        String storedCode = redisTemplate.opsForValue().get(codeKey(identity));
        if (storedCode == null) {
            throw new BadCredentialsException("Invalid or expired verification code");
        }

        if (!storedCode.equals(code)) {
            registerFailedAttempt(identity);
            throw new BadCredentialsException("Invalid or expired verification code");
        }

        String pendingJson = redisTemplate.opsForValue().get(redisKey(identity));
        if (pendingJson == null) {
            throw new IllegalStateException("No pending password change found");
        }

        PendingPasswordChange pending;
        try {
            pending = jsonMapper.readValue(pendingJson, PendingPasswordChange.class);
        } catch (JacksonException e) {
            throw new IllegalStateException("Failed to parse pending password change", e);
        }

        account.setPassword(pending.newPasswordHash());

        switch (identity.type()) {
            case CUSTOMER -> customerRepository.save((Customer) account);
            case EMPLOYEE -> employeeRepository.save((Employee) account);
        }

        clearPending(identity);

        authService.logout(request, null);
    }

    // ---- HELPERS --------------------------------------------
    private Account loadLocalAccount(AccountIdentity identity) {
        return switch (identity.type()) {
            case CUSTOMER -> {
                Customer customer = customerRepository.findByIdOrThrow(identity.id());

                if (customer.getProvider() == AuthProvider.GOOGLE) {
                    throw new BadRequestException("Password change is not available for Google accounts");
                }

                yield customer;
            }
            case EMPLOYEE -> employeeRepository.findByIdOrThrow(identity.id());
        };
    }

    private void registerFailedAttempt(AccountIdentity identity) {
        String key = attemptsKey(identity);
        Long attempts = redisTemplate.opsForValue().increment(key);

        if (attempts != null && attempts == 1) {
            redisTemplate.expire(key, CODE_TTL);
        }

        if (attempts != null && attempts >= MAX_ATTEMPTS) {
            clearPending(identity);
            throw new BadCredentialsException("Too many attempts. Please request a new code");
        }
    }

    private void clearPending(AccountIdentity identity) {
        redisTemplate.delete(codeKey(identity));
        redisTemplate.delete(redisKey(identity));
        redisTemplate.delete(attemptsKey(identity));
    }

    private String redisKey(AccountIdentity identity) {
        return "password-change:pending:%s:%s".formatted(identity.type(), identity.id());
    }

    private String codeKey(AccountIdentity identity) {
        return "password-change:code:%s:%s".formatted(identity.type(), identity.id());
    }

    private String attemptsKey(AccountIdentity identity) {
        return "password-change:attempts:%s:%s".formatted(identity.type(), identity.id());
    }

    private void sendVerificationEmail(String toEmail, String code) {
        brevoMailService.send(
                toEmail,
                "Confirm your password change",
                "Your verification code is: " + code + "\nIt expires in 2 minutes.");
    }

    private record PendingPasswordChange(UUID accountId, AccountIdentity.AccountType type, String newPasswordHash) {
    }
}