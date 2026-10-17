package com.ahmedesawy.floria.coupon.dto;

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
public class SummaryCouponResponse {

    private Integer id;
    private String code;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minimumOrderAmount;
    private LocalDateTime endAt;
    private Boolean active;
    private String usage;
    private Boolean valid;

}
