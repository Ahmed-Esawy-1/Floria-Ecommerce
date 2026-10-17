package com.ahmedesawy.floria.watchlist.dto;

import java.math.BigDecimal;

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
public class WatchlistProductResponse {
    private Long id;
    private Long productId;
    private String productNameEn;
    private String productNameAr;
    private String primaryImage;
    private BigDecimal originalPrice;
    private BigDecimal priceAfterDiscount;
}
