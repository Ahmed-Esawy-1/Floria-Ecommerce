package com.ahmedesawy.floria.city.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CityResponse {
    private Integer id;
    private String nameEn;
    private String nameAr;
    private BigDecimal deliveryPrice;
}