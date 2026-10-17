package com.ahmedesawy.floria.user.employee.dto.response;

import java.util.UUID;

import com.ahmedesawy.floria.role.dto.RoleSummary;
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
public class UpdateEmployeeResponse extends UserResponse {
    private UUID roleId;
    private RoleSummary role;
}
