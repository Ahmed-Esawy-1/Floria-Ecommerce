package com.ahmedesawy.floria.order.dto.response;

import java.math.BigDecimal;

import com.ahmedesawy.floria.common.base.DiscountType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder 
public class OrderItemResponse {
   private Long id;
   private String productNameEn;
   private String productNameAr;
   private Integer quantity;


   private BigDecimal originalPrice;    
   private BigDecimal unitPrice;        
   private BigDecimal totalPrice;        


   private Boolean hasOffer;
   private DiscountType offerDiscountType;   // PERCENTAGE or FIXED
   private BigDecimal offerDiscountValue;    // e.g. 15 or 50.00
   private BigDecimal offerDiscountAmount;
}
