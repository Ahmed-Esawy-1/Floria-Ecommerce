package com.ahmedesawy.floria.auth.passwordChange;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.auth.PrincipalResolver;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/account/change-password")
@RequiredArgsConstructor
public class PasswordChangeController {

    private final PasswordChangeService passwordChangeService;
    private final PrincipalResolver principalResolver;

    @PutMapping
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        passwordChangeService.requestPasswordChange(request, principalResolver.resolve(authentication));
        return ResponseEntity.ok("Verification code sent to your email");
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmPasswordChange(
            @Valid @RequestBody VerifyPasswordChangeRequest verifyRequest,
            Authentication authentication,
            HttpServletRequest request) {
        passwordChangeService.confirmPasswordChange(verifyRequest.getCode(),
                principalResolver.resolve(authentication), request);
        return ResponseEntity.ok("Password changed successfully");
    }

}
