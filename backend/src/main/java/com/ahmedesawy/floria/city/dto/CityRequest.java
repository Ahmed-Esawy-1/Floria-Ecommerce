package com.ahmedesawy.floria.city.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CityRequest {

    @NotBlank(message = "The name of city in english is required")
    private String nameEn;

    @NotBlank(message = "The name of city in arabic is required")
    private String nameAr;

    @NotNull(message = "Delivery price is required")
    @Positive
    private BigDecimal deliveryPrice;
    
    @NotNull(message = "Available status is required")
    private Boolean available;
}
