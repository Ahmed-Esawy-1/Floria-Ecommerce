package com.ahmedesawy.floria.auth.signupVerify;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifySignupRequest {
    @NotBlank
    private String email;

    @Pattern(regexp = "^[A-Za-z0-9]{6}$", message = "Code must be 6 letters or digits")
    private String code;
}
