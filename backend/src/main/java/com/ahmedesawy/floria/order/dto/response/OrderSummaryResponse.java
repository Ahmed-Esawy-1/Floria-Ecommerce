package com.ahmedesawy.floria.order.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ahmedesawy.floria.order.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@SuperBuilder
public class OrderSummaryResponse {
   private Long id;
   private String orderId;
   private String fullName;
   private String customerEmail;
   private String customerImage;
   private LocalDateTime createdAt;
   private BigDecimal totalPrice;
   private OrderStatus status;
   private String cityNameEn;
   private String cityNameAr;
}
