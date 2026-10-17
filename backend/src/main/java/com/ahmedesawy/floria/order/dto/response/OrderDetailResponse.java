package com.ahmedesawy.floria.order.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.ahmedesawy.floria.order.OrderStatus;
import com.ahmedesawy.floria.order.Payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class OrderDetailResponse extends OrderSummaryResponse {
    private BigDecimal deliveryPrice;
    private BigDecimal discountAmount;
    private OrderStatus status;
    private Payment paymentMethod;
    private String phone;
    private String shippingAddress;
    private String hint;
    private List<OrderItemResponse> items;
}
