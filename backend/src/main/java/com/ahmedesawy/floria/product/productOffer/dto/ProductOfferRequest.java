package com.ahmedesawy.floria.product.productOffer.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ahmedesawy.floria.common.base.DiscountType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductOfferRequest {

    private DiscountType discountType;

    @DecimalMin(value = "0.0", inclusive = false, message = "Discount value must be positive")
    private BigDecimal discountValue;

    @NotNull(message = "Start date is required")
    private LocalDateTime startAt;

    @NotNull(message = "End date is required")
    private LocalDateTime endAt;

    private Boolean isActive = true;
}