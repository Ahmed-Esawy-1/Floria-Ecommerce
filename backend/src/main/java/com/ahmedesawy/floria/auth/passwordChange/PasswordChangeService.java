package com.ahmedesawy.floria.auth.passwordChange;

import java.time.Duration;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ahmedesawy.floria.auth.AccountIdentity;
import com.ahmedesawy.floria.auth.AuthService;
import com.ahmedesawy.floria.common.exception.BadRequestException;
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

    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;
    private final JsonMapper jsonMapper;
    private final JavaMailSender mailSender;
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

        sendVerificationEmail(identity.email(), code);
    }

    public void confirmPasswordChange(String code, AccountIdentity identity, HttpServletRequest request) {
        Account account = loadLocalAccount(identity);

        String storedCode = redisTemplate.opsForValue().get(codeKey(identity));
        if (storedCode == null || !storedCode.equals(code)) {
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

        // Clean up
        redisTemplate.delete(codeKey(identity));
        redisTemplate.delete(redisKey(identity));

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

    private String redisKey(AccountIdentity identity) {
        return "password-change:pending:%s:%s".formatted(identity.type(), identity.id());
    }

    private String codeKey(AccountIdentity identity) {
        return "password-change:code:%s:%s".formatted(identity.type(), identity.id());
    }

    private void sendVerificationEmail(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Confirm your password change");
        message.setText("Your verification code is: " + code + "\nIt expires in 2 minutes.");
        mailSender.send(message);
    }

    private record PendingPasswordChange(UUID accountId, AccountIdentity.AccountType type, String newPasswordHash) {
    }
}