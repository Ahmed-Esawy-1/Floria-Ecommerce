package com.ahmedesawy.floria.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class TopProductDTO {
    private Long id;
    private String nameEn;
    private String nameAr;
    private Long orderCount;
}