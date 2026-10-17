package com.ahmedesawy.floria.coupon.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ahmedesawy.floria.common.base.DiscountType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CoupounRequest {

    @NotBlank(message = "Code is required")
    private String code;

    @NotNull(message = "Discount Type is required")
    private DiscountType discountType;

    @NotNull(message = "Discount Value is required")
    @Positive(message = "Discount Value should be positive.")
    private BigDecimal discountValue;

    @NotNull(message = "Minimum Amount is required")
    @Positive(message = "Minimum Amount should be positive.")
    private BigDecimal minimumOrderAmount;

    @NotNull(message = "Maximum Amount is required")
    @Positive(message = "Maximum Amount should be positive.")
    private BigDecimal maximumDiscountAmount;

    @NotNull(message = "Start At is required")
    private LocalDateTime startAt;

    @NotNull(message = "End At is required")
    private LocalDateTime endAt;

    @NotNull(message = "Active is required")
    private Boolean active = true;

    @NotNull(message = "Usage Limit is required")
    @Positive(message = "Usage Limit should be positive.")
    @DecimalMin(value = "5", message = "Usage Limit should be greater than 5")
    private Integer usageLimit;

}