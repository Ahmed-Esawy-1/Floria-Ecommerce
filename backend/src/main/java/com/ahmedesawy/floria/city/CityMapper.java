package com.ahmedesawy.floria.city;

import com.ahmedesawy.floria.city.dto.CityResponse;

public class CityMapper {
    // ---- MAIN
    public static CityResponse toResponse(City city) {
        return CityResponse.builder()
                .id(city.getId())
                .nameEn(city.getNameEn())
                .nameAr(city.getNameAr())
                .deliveryPrice(city.getDeliveryPrice())
                .build();
    }
}
