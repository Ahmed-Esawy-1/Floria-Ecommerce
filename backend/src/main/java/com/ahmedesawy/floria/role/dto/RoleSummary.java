package com.ahmedesawy.floria.role.dto;

import java.util.UUID;

import com.ahmedesawy.floria.role.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleSummary {

    private UUID id;
    private String code;
    private String nameEn;
    private String nameAr;

    public static RoleSummary from(Role role) {
        if (role == null)
            return null;
        return RoleSummary.builder()
                .id(role.getId())
                .code(role.getCode())
                .nameEn(role.getNameEn())
                .nameAr(role.getNameAr())
                .build();
    }
}