package com.ahmedesawy.floria.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSearchResponse {
    private Long id;
    private String nameEn;
    private String nameAr;
    private String primaryImageUrl;
}