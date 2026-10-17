package com.ahmedesawy.floria.product.dto.response;

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
public class ProductSummaryResponse {
   private Long id;
   private String nameEn;
   private String nameAr;
   private String primaryImageUrl;
   private BigDecimal price;
   private BigDecimal priceAfterDiscount;
   // used in cart
   private boolean hasColor;
   private String colorNameEn;
   private String colorNameAr;
}