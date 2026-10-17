package com.ahmedesawy.floria.role.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RoleResponse {
    private UUID id;
    private String code;
    private String nameEn;
    private String nameAr;
    private String descriptionEn;
    private String descriptionAr;
}