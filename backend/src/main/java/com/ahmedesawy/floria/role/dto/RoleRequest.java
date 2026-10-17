package com.ahmedesawy.floria.role.dto;

import java.util.Set;

import com.ahmedesawy.floria.role.Permission;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleRequest {
    @NotBlank(message = "Role code is required")
    @Pattern(regexp = "^[A-Z][A-Z_]*$", message = "Code must be uppercase letters and underscores only")
    private String code;

    @NotBlank(message = "English role name is required")
    private String nameEn;

    @NotBlank(message = "Arabic role name is required")
    private String nameAr;

    @NotBlank(message = "English role description is required")
    private String descriptionEn;

    @NotBlank(message = "Arabic role description is required")
    private String descriptionAr;

    @NotEmpty(message = "At least one permission is required")
    private Set<Permission> permissions;
}