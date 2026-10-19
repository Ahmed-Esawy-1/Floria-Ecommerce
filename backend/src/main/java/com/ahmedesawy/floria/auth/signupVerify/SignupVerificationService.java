package com.ahmedesawy.floria.auth.signupVerify;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.ahmedesawy.floria.auth.AccountIdentity;
import com.ahmedesawy.floria.common.exception.NotFoundException;
import com.ahmedesawy.floria.common.util.CodeGenerator;
import com.ahmedesawy.floria.user.customer.Customer;
import com.ahmedesawy.floria.user.customer.CustomerRepository;
import com.ahmedesawy.floria.user.employee.Employee;
import com.ahmedesawy.floria.user.employee.EmployeeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SignupVerificationService {

    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final StringRedisTemplate redisTemplate;
    private final JavaMailSender mailSender;

    private static final Duration CODE_TTL = Duration.ofMinutes(2);
    private static final Duration RESEND_COOLDOWN = Duration.ofSeconds(60);
    private static final int MAX_VERIFY_ATTEMPTS = 5;

    public void sendVerificationCode(String email, AccountIdentity.AccountType type) {
        String code = CodeGenerator.generate(6);
        redisTemplate.opsForValue().set(
                codeKey(email, type),
                code,
                CODE_TTL);
        sendVerificationEmail(email, code);
    }

    public void verify(VerifySignupRequest request) {

        String email = request.getEmail();

        AccountIdentity.AccountType type = customerRepository.existsByEmail(email)
                ? AccountIdentity.AccountType.CUSTOMER
                : AccountIdentity.AccountType.EMPLOYEE;

        String storedCodeKey = codeKey(email, type);
        String attemptsKeyStr = attemptsKey(email, type);

        String storedCode = redisTemplate.opsForValue().get(codeKey(request.getEmail(), type));
        if (storedCode == null) {
            throw new BadCredentialsException("Invalid or expired verification code");
        }

        String submitted = request.getCode().trim().toUpperCase();

        if (!MessageDigest.isEqual(
                storedCode.getBytes(StandardCharsets.UTF_8),
                submitted.getBytes(StandardCharsets.UTF_8))) {
            long attempts = registerFailedAttempt(storedCodeKey, attemptsKeyStr);

            if (attempts >= MAX_VERIFY_ATTEMPTS) {
                redisTemplate.delete(storedCodeKey);
                redisTemplate.delete(attemptsKeyStr);
                throw new BadCredentialsException(
                        "Too many failed attempts. Please request a new verification code.");
            }

            throw new BadCredentialsException("Invalid or expired verification code");
        }

        switch (type) {
            case CUSTOMER -> {
                Customer customer = customerRepository.findByEmail(request.getEmail())
                        .orElseThrow(() -> new NotFoundException("Account not found"));

                if (customer.isEmailVerified())
                    throw new IllegalStateException("Account already verified");
                customer.setEmailVerified(true);
                customerRepository.save(customer);
            }
            case EMPLOYEE -> {
                Employee employee = employeeRepository.findByEmail(request.getEmail())
                        .orElseThrow(() -> new NotFoundException("Account not found"));

                if (employee.isEmailVerified())
                    throw new IllegalStateException("Account already verified");
                employee.setEmailVerified(true);
                employeeRepository.save(employee);
            }
        }

        redisTemplate.delete(storedCodeKey);
        redisTemplate.delete(attemptsKeyStr);
    }

    // ---- RESEND -----
    public void resend(String email) {
        AccountIdentity.AccountType type = customerRepository.existsByEmail(email)
                ? AccountIdentity.AccountType.CUSTOMER
                : AccountIdentity.AccountType.EMPLOYEE;

        boolean unverified = switch (type) {
            case CUSTOMER -> customerRepository.findByEmail(email)
                    .map(c -> !c.isEmailVerified())
                    .orElseThrow(() -> new NotFoundException("Account not found"));

            case EMPLOYEE -> employeeRepository.findByEmail(email)
                    .map(e -> !e.isEmailVerified())
                    .orElseThrow(() -> new NotFoundException("Account not found"));
        };
        if (!unverified)
            throw new IllegalStateException("Account already verified");

        String cooldownKey = cooldownKey(email, type);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(cooldownKey))) {
            throw new IllegalStateException("Please wait before requesting another code");
        }
        redisTemplate.opsForValue().set(
                cooldownKey,
                "1",
                RESEND_COOLDOWN);

        redisTemplate.delete(attemptsKey(email, type));

        sendVerificationCode(email, type);
    }

    // ---- HELPERS --------------------------------------------------------
    private String codeKey(String email, AccountIdentity.AccountType type) {
        return "signup-verification:code:%s:%s".formatted(type, email);
    }

    private String cooldownKey(String email, AccountIdentity.AccountType type) {
        return "signup-verification:cooldown:%s:%s".formatted(type, email);
    }

    private String attemptsKey(String email, AccountIdentity.AccountType type) {
        return "signup-verification:attempts:%s:%s".formatted(type, email);
    }

    private void sendVerificationEmail(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify your email");
        message.setText("Your verification code is: " + code + "\nIt expires in 2 minutes.");
        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("MAIL FAILED", e);
            throw e;
        }
    }

    private long registerFailedAttempt(String codeKey, String attemptsKey) {
        Long attempts = redisTemplate.opsForValue().increment(attemptsKey);

        if (attempts != null && attempts == 1L) {
            Long codeTtl = redisTemplate.getExpire(codeKey, java.util.concurrent.TimeUnit.SECONDS);
            if (codeTtl != null && codeTtl > 0) {
                redisTemplate.expire(attemptsKey, Duration.ofSeconds(codeTtl));
            } else {
                redisTemplate.expire(attemptsKey, CODE_TTL);
            }
        }

        return attempts != null ? attempts : 0L;
    }

}
