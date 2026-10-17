package com.ahmedesawy.floria.product.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ProductPriceRangeResponse {
   BigDecimal minPrice;
   BigDecimal maxPrice;
} 
