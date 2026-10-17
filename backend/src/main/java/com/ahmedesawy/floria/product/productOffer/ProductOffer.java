package com.ahmedesawy.floria.product.productOffer;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import com.ahmedesawy.floria.common.base.DiscountType;
import com.ahmedesawy.floria.product.Product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ProductOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(nullable = false)
    private LocalDateTime startAt;

    @Column(nullable = false)
    private LocalDateTime endAt;

    @Column(nullable = false)
    private Boolean isActive = true;

    // ---- HELPERS -----------------------------

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(endAt);
    }

    public boolean hasStarted() {
        return !LocalDateTime.now().isBefore(startAt);
    }

    public boolean isWithinDateRange() {
        LocalDateTime now = LocalDateTime.now();
        return !now.isBefore(startAt) && !now.isAfter(endAt);
    }

    public boolean isUsable() {
        return Boolean.TRUE.equals(isActive) && isWithinDateRange();
    }

    public BigDecimal calculatePriceAfterDiscount(BigDecimal originalPrice) {
        if (discountType == DiscountType.PERCENTAGE) {
            return originalPrice
                    .multiply(BigDecimal.valueOf(100).subtract(discountValue))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }

        // FIXED amount
        BigDecimal result = originalPrice.subtract(discountValue);
        return result.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : result;
    }

    public void validateDateRange() {
        if (startAt == null || endAt == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }
        if (!endAt.isAfter(startAt)) {
            throw new IllegalArgumentException("End date must be after start date");
        }
    }

    public void validateDiscount() {
        if (discountType == null) {
            throw new IllegalArgumentException("Discount type is required");
        }
        if (discountValue == null) {
            throw new IllegalArgumentException("Discount value is required");
        }
        if (discountValue.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Discount value cannot be negative");
        }
        if (discountType == DiscountType.PERCENTAGE
                && discountValue.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException("Percentage discount cannot exceed 100");
        }
    }
}