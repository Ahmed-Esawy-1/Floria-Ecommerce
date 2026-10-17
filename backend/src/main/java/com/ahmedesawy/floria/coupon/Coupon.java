package com.ahmedesawy.floria.coupon;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.ahmedesawy.floria.common.base.DiscountType;
import com.ahmedesawy.floria.common.exception.BadRequestException;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DiscountType discountType;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discountValue;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal minimumOrderAmount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal maximumDiscountAmount;

    @Column(nullable = false)
    private LocalDateTime startAt;

    @Column(nullable = false)
    private LocalDateTime endAt;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Integer usageLimit;

    @Builder.Default
    @Column(nullable = false)
    private Integer usedCount = 0;

    @Builder.Default
    @Column(nullable = false)
    private Boolean usageEnded = false;

    @Builder.Default
    @Column(nullable = false)
    private Boolean dateEnded = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Check if coupon is currently valid
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return active
            && !usageEnded
            && !dateEnded
            && now.isAfter(startAt)
            && now.isBefore(endAt)
            && usedCount < usageLimit;
    }

    public void isDatesValid() {
        if (startAt == null || endAt == null)
            throw new BadRequestException("Start and end dates cannot be null");
    
        if (!startAt.isBefore(endAt))
            throw new BadRequestException("Start date must be before end date");
    }


    public void isDiscountValid() {
        if (discountType == null || discountValue == null) return;
    
        if (discountType == DiscountType.PERCENTAGE && discountValue.compareTo(BigDecimal.valueOf(100)) > 0) 
            throw new BadRequestException("Percentage discount value cannot be greater than 100");
        
    }

    public BigDecimal calculateDiscount(BigDecimal orderAmount) {
        if (orderAmount.compareTo(minimumOrderAmount) < 0) 
            throw new BadRequestException("Minimum order amount for this coupon is " + minimumOrderAmount);
        

        BigDecimal discount = switch (discountType) {
            case PERCENTAGE -> orderAmount.multiply(discountValue)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            case FIXED -> discountValue;
        };

        // Cap at maximumDiscountAmount regardless of type
        if (discount.compareTo(maximumDiscountAmount) > 0) {
            discount = maximumDiscountAmount;
        }

        // Never let discount exceed the order amount itself
        if (discount.compareTo(orderAmount) > 0) {
            discount = orderAmount;
        }

        return discount;
    }

}