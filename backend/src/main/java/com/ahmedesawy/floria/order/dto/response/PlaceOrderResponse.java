package com.ahmedesawy.floria.order.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PlaceOrderResponse {
    private String orderId;
    private BigDecimal totalPrice;
}
