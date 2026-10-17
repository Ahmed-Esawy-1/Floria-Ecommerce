package com.ahmedesawy.floria.auth.passwordChange;

import com.ahmedesawy.floria.common.validation.FieldsMatch;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.Pattern;

@Getter
@Setter
@FieldsMatch (first = "newPassword", second = "confirmNewPassword", message = "New password and confirmation do not match")
public class ChangePasswordRequest {

    @NotBlank
    private String oldPassword;

    @NotBlank
    @Size(min = 8)
    @Pattern(
        regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
        message = "Password must be at least 8 characters contain at least one Letter and one digit"
    )
    private String newPassword;
    @NotBlank
    private String confirmNewPassword;

}
