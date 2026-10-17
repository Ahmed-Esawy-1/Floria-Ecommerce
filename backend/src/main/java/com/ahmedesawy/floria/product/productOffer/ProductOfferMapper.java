package com.ahmedesawy.floria.product.productOffer;

import com.ahmedesawy.floria.product.productOffer.dto.ProductOfferResponse;

public class ProductOfferMapper {
    
    // ---- MAIN 
    public static ProductOfferResponse toResponse(ProductOffer offer) {
        return ProductOfferResponse.builder()
                .id(offer.getId())
                .productId(offer.getProduct().getId())
                .productNameEn(offer.getProduct().getNameEn())
                .productNameAr(offer.getProduct().getNameAr())
                .discountType(offer.getDiscountType())
                .discountValue(offer.getDiscountValue())
                .startAt(offer.getStartAt())
                .endAt(offer.getEndAt())
                .isActive(offer.getIsActive())
                .expired(offer.isExpired())
                .build();
    }
}
