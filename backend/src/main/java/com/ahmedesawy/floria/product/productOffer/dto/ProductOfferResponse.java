package com.ahmedesawy.floria.product.productOffer.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ahmedesawy.floria.common.base.DiscountType;

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
public class ProductOfferResponse {
    private Long id;
    private Long productId;
    private String productNameEn;
    private String productNameAr;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Boolean isActive;
    private Boolean expired;
}