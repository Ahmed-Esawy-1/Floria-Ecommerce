package com.ahmedesawy.floria.order;

import java.math.BigDecimal;
import java.util.List;

import com.ahmedesawy.floria.common.base.DiscountType;
import com.ahmedesawy.floria.common.util.ImageUrlResolver;
import com.ahmedesawy.floria.order.dto.response.OrderDetailResponse;
import com.ahmedesawy.floria.order.dto.response.OrderItemResponse;
import com.ahmedesawy.floria.order.dto.response.OrderSummaryResponse;
import com.ahmedesawy.floria.order.item.OrderItem;

public class OrderMapper {

    // ---- MAIN
    public static OrderDetailResponse toResponse(Order order) {
        return OrderDetailResponse.builder()
                .orderId(order.getOrderId())
                .fullName(order.getFullName())
                .totalPrice(order.getTotalPrice())
                .deliveryPrice(order.getDeliveryPrice())
                .discountAmount(order.getDiscountAmount())
                .cityNameEn(order.getCity().getNameEn())
                .cityNameAr(order.getCity().getNameAr())
                .shippingAddress(order.getShippingAddress())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .phone(order.getPhone())
                .hint(order.getHint())
                .items(mapItems(order))
                .createdAt(order.getCreatedAt())
                .build();
    }

    // ---- Order Summary
    public static OrderSummaryResponse toSummary(Order order) {
        return OrderSummaryResponse.builder()
                .id(order.getId())
                .orderId(order.getOrderId())
                .fullName(order.getFullName())
                .customerEmail(order.getCustomer().getEmail())
                .customerImage(ImageUrlResolver.resolve("users", order.getCustomer().getImageUrl()))
                .createdAt(order.getCreatedAt())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .cityNameEn(order.getCity().getNameEn())
                .cityNameAr(order.getCity().getNameAr())
                .build();
    }

    // ---- ORDER ITEMS
    private static List<OrderItemResponse> mapItems(Order order) {
        return order.getItems()
                .stream()
                .map(OrderMapper::mapItem)
                .toList();
    }

    // ---- ITEM
    private static OrderItemResponse mapItem(OrderItem item) {
        boolean hasOffer = item.getOfferDiscountType() != null && item.getOfferDiscountValue() != null;

        BigDecimal totalPrice = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        BigDecimal offerDiscountAmount = null;
        if (hasOffer) {
            if (item.getOfferDiscountType() == DiscountType.PERCENTAGE) {
                // e.g. 15% of originalPrice * quantity
                offerDiscountAmount = item.getOriginalPrice()
                        .multiply(item.getOfferDiscountValue())
                        .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(item.getQuantity()));
            } else {
                // FIXED
                offerDiscountAmount = item.getOfferDiscountValue().multiply(BigDecimal.valueOf(item.getQuantity()));
            }
        }

        return OrderItemResponse.builder()
                .id(item.getId())
                .productNameEn(item.getProduct() != null ? item.getProduct().getNameEn() : null)
                .productNameAr(item.getProduct() != null ? item.getProduct().getNameAr() : null)
                .quantity(item.getQuantity())
                .originalPrice(item.getOriginalPrice())
                .unitPrice(item.getUnitPrice())
                .totalPrice(totalPrice)
                .hasOffer(hasOffer)
                .offerDiscountType(item.getOfferDiscountType())
                .offerDiscountValue(item.getOfferDiscountValue())
                .offerDiscountAmount(offerDiscountAmount)
                .build();
    }

}