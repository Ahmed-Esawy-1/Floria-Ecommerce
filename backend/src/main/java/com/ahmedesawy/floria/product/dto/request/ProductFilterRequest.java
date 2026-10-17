package com.ahmedesawy.floria.product.dto.request;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductFilterRequest {
   private List<Integer> categoryIds;
   private List<Integer> occasionIds;
   private List<Integer> colorIds;
   private BigDecimal minPrice;
   private BigDecimal maxPrice;
   private String sortBy; // "newest" | "bestSellers" | null
   private Boolean onOffer;
}
