package com.ahmedesawy.floria.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 20, message = "min is 6 characters and max is 20 characters")
    private String password;
    private boolean rememberMe = false;
}
