package com.ahmedesawy.floria.auth.oauth;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.ahmedesawy.floria.auth.AccountIdentity;
import com.ahmedesawy.floria.auth.JwtService;
import com.ahmedesawy.floria.auth.RefreshTokenService;
import com.ahmedesawy.floria.common.exception.OAuthLoginException;
import com.ahmedesawy.floria.user.AuthProvider;
import com.ahmedesawy.floria.user.customer.Customer;
import com.ahmedesawy.floria.user.customer.CustomerRepository;
import com.ahmedesawy.floria.user.employee.EmployeeRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private static final Duration CUSTOMER_SESSION = Duration.ofHours(24);

    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final OAuthExchangeService oAuthExchangeService;

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");
            String picture = oAuth2User.getAttribute("picture");

            Customer customer = customerRepository.findByEmail(email)
                    .map(existing -> {
                        if (existing.getProvider() == AuthProvider.LOCAL) {
                            throw new OAuthLoginException("account_exists");
                        }
                        existing.setUserName(name);
                        existing.setImageUrl(picture);
                        return customerRepository.save(existing);
                    })
                    .orElseGet(() -> {
                        if (employeeRepository.findByEmail(email).isPresent()) {
                            throw new OAuthLoginException("employee_account");
                        }
                        return customerRepository.save(
                                Customer.builder()
                                        .email(email)
                                        .userName(name)
                                        .imageUrl(picture)
                                        .emailVerified(true)
                                        .password(null)
                                        .provider(AuthProvider.GOOGLE)
                                        .build());
                    });

            Map<String, Object> claims = Map.of("id", customer.getId());
            String accessToken = jwtService.generateToken(
                    customer.getEmail(), claims, CUSTOMER_SESSION.toMillis());

            String refreshToken = refreshTokenService.create(
                    customer.getId(), AccountIdentity.AccountType.CUSTOMER);

            ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(Duration.ofDays(365))
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            String code = oAuthExchangeService.store(accessToken);
            response.sendRedirect(frontendBaseUrl + "/oauth/callback?code=" + code);

        } catch (OAuthLoginException ex) {
            response.sendRedirect(frontendBaseUrl + "/login?error=" + ex.getCode());
        } catch (Exception ex) {
            response.sendRedirect(frontendBaseUrl + "/login?error=oauth");
        }
    }
}