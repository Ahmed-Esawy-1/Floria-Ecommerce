package com.ahmedesawy.floria.product.specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ahmedesawy.floria.common.base.DiscountType;
import com.ahmedesawy.floria.product.Product;
import com.ahmedesawy.floria.product.productOffer.ProductOffer;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Root;

/**
 * Everything related to offers and discounted prices in SQL.
 * The rules here must match ProductOffer.isUsable() and
 * calculatePriceAfterDiscount().
 */
public final class ProductPricing {

    private ProductPricing() {
    }

    /**
     * LEFT JOIN on the offer that is usable right now (active and inside its date
     * range).
     * The offer is one-to-one and unique per product, so rows are never duplicated.
     * Products without a usable offer stay in the result with a NULL offer.
     */
    public static Join<Product, ProductOffer> joinUsableOffer(Root<Product> root, CriteriaBuilder cb) {
        LocalDateTime now = LocalDateTime.now();

        Join<Product, ProductOffer> offer = root.join("offer", JoinType.LEFT);
        offer.on(
                cb.isTrue(offer.get("isActive")),
                cb.lessThanOrEqualTo(offer.get("startAt"), now),
                cb.greaterThanOrEqualTo(offer.get("endAt"), now));
        return offer;
    }

    /**
     * Price after discount, or the original price when there is no usable offer.
     * PERCENTAGE: price * (100 - value) / 100, rounded to 2 decimals.
     * FIXED: price - value, never below zero.
     */
    public static Expression<BigDecimal> effectivePrice(
            Root<Product> root, Join<Product, ProductOffer> offer, CriteriaBuilder cb) {

        Expression<BigDecimal> price = root.get("price");
        Expression<BigDecimal> value = offer.get("discountValue");
        Expression<BigDecimal> hundred = cb.literal(BigDecimal.valueOf(100));

        Expression<BigDecimal> percentage = cb.function(
                "round",
                BigDecimal.class,
                cb.quot(cb.prod(price, cb.diff(hundred, value)), hundred).as(BigDecimal.class),
                cb.literal(2));

        Expression<BigDecimal> fixed = cb.<BigDecimal>selectCase()
                .when(cb.greaterThan(price, value), cb.diff(price, value))
                .otherwise(BigDecimal.ZERO);

        return cb.<BigDecimal>selectCase()
                .when(cb.isNull(offer.get("id")), price)
                .when(cb.equal(offer.get("discountType"), DiscountType.PERCENTAGE), percentage)
                .otherwise(fixed);
    }
}