package com.ahmedesawy.floria.watchlist;

import java.math.BigDecimal;

import com.ahmedesawy.floria.product.Product;
import com.ahmedesawy.floria.product.ProductMapper;
import com.ahmedesawy.floria.product.productOffer.ProductOffer;
import com.ahmedesawy.floria.watchlist.dto.WatchlistProductResponse;

public class WatchlistMapper {

    // ---- MAIN
    public static WatchlistProductResponse toResponse(Watchlist watchlist) {
        Product product = watchlist.getProduct();
        BigDecimal originalPrice = product.getPrice();

        return WatchlistProductResponse.builder()
                .id(watchlist.getId())
                .productId(product.getId())
                .productNameEn(product.getNameEn())
                .productNameAr(product.getNameAr())
                .originalPrice(originalPrice)
                .priceAfterDiscount(resolvePriceAfterDiscount(product, originalPrice))
                .primaryImage(ProductMapper.resolvePrimaryImage(product))
                .build();
    }

    // ---- HELPERS -------------------------
    private static BigDecimal resolvePriceAfterDiscount(Product product, BigDecimal originalPrice) {
        ProductOffer offer = product.getOffer();

        if (offer == null || originalPrice == null || !offer.isUsable()) {
            return null;
        }
        return offer.calculatePriceAfterDiscount(originalPrice);
    }
}
