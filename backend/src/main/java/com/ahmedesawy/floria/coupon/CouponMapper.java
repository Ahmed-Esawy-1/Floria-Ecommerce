package com.ahmedesawy.floria.coupon;

import com.ahmedesawy.floria.coupon.dto.SummaryCouponResponse;

public class CouponMapper {

    // ---- SUMMARY (Dashboard Table)
    public static SummaryCouponResponse toSummaryResponse(Coupon coupon) {
        return SummaryCouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .active(coupon.getActive())
                .valid(coupon.isValid())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .minimumOrderAmount(
                        coupon.getMinimumOrderAmount())
                .usage(coupon.getUsedCount() + "/" + coupon.getUsageLimit())
                .endAt(coupon.getEndAt())
                .build();
    }

}
