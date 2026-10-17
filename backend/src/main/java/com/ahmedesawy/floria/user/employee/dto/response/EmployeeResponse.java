package com.ahmedesawy.floria.user.employee.dto.response;

import java.util.Set;

import com.ahmedesawy.floria.role.Permission;
import com.ahmedesawy.floria.user.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder 
public class EmployeeResponse extends UserResponse {
    private String role;
    private Set<Permission> permissions;
}