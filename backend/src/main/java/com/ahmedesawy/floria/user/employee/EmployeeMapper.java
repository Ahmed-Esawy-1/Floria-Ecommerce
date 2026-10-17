package com.ahmedesawy.floria.user.employee;

import com.ahmedesawy.floria.common.util.ImageUrlResolver;
import com.ahmedesawy.floria.role.dto.RoleSummary;
import com.ahmedesawy.floria.user.TrashUserResponse;
import com.ahmedesawy.floria.user.employee.dto.response.EmployeeResponse;
import com.ahmedesawy.floria.user.employee.dto.response.UpdateEmployeeResponse;

public class EmployeeMapper {

    // ---- MAIN EMPLOYEE Response
    public static EmployeeResponse toEmployeeResponse(Employee e) {
        return EmployeeResponse.builder()
                .id(e.getId())
                .userName(e.getUserName())
                .email(e.getEmail())
                .imageUrl(ImageUrlResolver.resolve("users", e.getImageUrl()))
                .role(e.getRole().getCode())
                .permissions(e.getRole().getPermissions())
                .build();
    }

    // ---- UPDATE EMPLOYEE Response
    public static UpdateEmployeeResponse toUpdateEmployeeResponse(Employee e) {
        return UpdateEmployeeResponse.builder()
                .id(e.getId())
                .userName(e.getUserName())
                .email(e.getEmail())
                .imageUrl(ImageUrlResolver.resolve("users", e.getImageUrl()))
                .roleId(e.getRole().getId())
                .role(RoleSummary.from(e.getRole()))
                .build();
    }

    // --- TRASH Response
    public static TrashUserResponse toTrashResponse(Employee e) {
        return TrashUserResponse.builder()
                .id(e.getId())
                .userName(e.getUserName())
                .imageUrl(ImageUrlResolver.resolve("users", e.getImageUrl()))
                .deletedAt(e.getDeletedAt())
                .build();
    }

}
