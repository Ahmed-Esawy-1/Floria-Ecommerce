package com.ahmedesawy.floria.auth.passwordChange;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class VerifyPasswordChangeRequest {
    @NotBlank 
    private String code;
}
