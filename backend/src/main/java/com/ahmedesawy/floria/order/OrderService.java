package com.ahmedesawy.floria.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.city.City;
import com.ahmedesawy.floria.city.CityRepository;
import com.ahmedesawy.floria.common.base.DiscountType;
import com.ahmedesawy.floria.common.exception.AccessDeniedException;
import com.ahmedesawy.floria.common.exception.BadRequestException;
import com.ahmedesawy.floria.coupon.Coupon;
import com.ahmedesawy.floria.coupon.CouponService;
import com.ahmedesawy.floria.order.dto.request.OrderItemRequest;
import com.ahmedesawy.floria.order.dto.request.OrderRequest;
import com.ahmedesawy.floria.order.dto.response.OrderDetailResponse;
import com.ahmedesawy.floria.order.dto.response.OrderSummaryResponse;
import com.ahmedesawy.floria.order.dto.response.PlaceOrderResponse;
import com.ahmedesawy.floria.order.item.OrderItem;
import com.ahmedesawy.floria.product.Product;
import com.ahmedesawy.floria.product.ProductRepository;
import com.ahmedesawy.floria.product.productOffer.ProductOffer;
import com.ahmedesawy.floria.product.productOffer.ProductOfferRepository;
import com.ahmedesawy.floria.user.customer.Customer;
import com.ahmedesawy.floria.user.customer.CustomerRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductOfferRepository productOfferRepository;
    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;

    private final CouponService couponService;

    // ---- QUIRES ----------------------------------------------
    @Transactional(readOnly = true)
    public Page<OrderSummaryResponse> getOrdersSummary(Pageable pageable, OrderStatus status) {
        Page<Order> orders = status != null
                ? orderRepository.findByStatus(status, pageable)
                : orderRepository.findAll(pageable);

        return orders.map(OrderMapper::toSummary);
    }

    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderById(Long id) {
        Order order = orderRepository.findByIdOrThrow(id, "Order");
        return OrderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderSummaryResponse getOrderSummaryById(Long id) {
        Order order = orderRepository.findByIdOrThrow(id, "Order");
        return OrderMapper.toSummary(order);
    }

    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderByOrderId(String orderId) {
        Order order = orderRepository.findByOrderId(orderId);
        return OrderMapper.toResponse(order);
    }

    // ---- QUERIES (CUSTOMER) -----------------------------------------------
    @Transactional(readOnly = true)
    public Page<OrderDetailResponse> getOrdersForCustomer(UUID customerId, Pageable pageable, OrderStatus status) {
        Page<Order> orders = (status != null)
                ? orderRepository.findByCustomer_IdAndStatus(customerId, status, pageable)
                : orderRepository.findByCustomer_Id(customerId, pageable);

        return orders.map(OrderMapper::toResponse);
    }

    // ---- CREATE ----------------------------------------------
    @Transactional
    public PlaceOrderResponse placeOrder(OrderRequest request, UUID customerId) {

        if (request.getPaymentMethod() != Payment.CASH)
            throw new IllegalStateException("Payment method is not available now");

        Customer customer = customerRepository.findByIdOrThrow(customerId);
        City city = cityRepository.findByIdOrThrow(request.getCityId());

        if (!Boolean.TRUE.equals(city.getAvailable()))
            throw new IllegalStateException("Delivery is not available for this city");

        Order order = Order.builder()
                .orderId(generateUniqueOrderId())
                .fullName(request.getFullName())
                .customer(customer)
                .city(city)
                .shippingAddress(request.getAddress())
                .deliveryPrice(city.getDeliveryPrice())
                .status(OrderStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .phone(request.getPhone())
                .hint(request.getHint())
                .build();

        // Product IDs
        List<Long> productIds = request.getItems()
                .stream()
                .map(OrderItemRequest::getProductId)
                .toList();

        // Load products
        List<Product> products = productRepository.findAllById(productIds);

        Map<Long, Product> productById = products.stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        // Check all products exist
        if (productById.size() != productIds.size()) {
            Set<Long> foundIds = productById.keySet();
            List<Long> missingIds = productIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new EntityNotFoundException("Products not found: " + missingIds);
        }

        // Load active & usable offers
        Map<Long, ProductOffer> activeOffers = productOfferRepository
                .findActiveOffersByProductIds(productIds, LocalDateTime.now())
                .stream()
                .filter(ProductOffer::isUsable)
                .collect(Collectors.toMap(offer -> offer.getProduct().getId(), Function.identity()));

        boolean hasActiveOffer = !activeOffers.isEmpty();

        // Order items + calculate items total
        BigDecimal itemsTotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productById.get(itemRequest.getProductId());
            ProductOffer offer = activeOffers.get(product.getId());

            BigDecimal originalPrice = product.getPrice();
            BigDecimal unitPrice;
            DiscountType offerDiscountType = null;
            BigDecimal offerDiscountValue = null;

            if (offer != null) {
                unitPrice = offer.calculatePriceAfterDiscount(originalPrice);
                offerDiscountType = offer.getDiscountType();
                offerDiscountValue = offer.getDiscountValue();
            } else {
                unitPrice = originalPrice;
            }

            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            itemsTotal = itemsTotal.add(lineTotal);

            orderItems.add(
                    OrderItem.builder()
                            .order(order)
                            .product(product)
                            .quantity(itemRequest.getQuantity())
                            .originalPrice(originalPrice)
                            .unitPrice(unitPrice)
                            .offerDiscountType(offerDiscountType)
                            .offerDiscountValue(offerDiscountValue)
                            .build());
        }

        order.setItems(orderItems);

        // Coupon Logic
        BigDecimal discount = BigDecimal.ZERO;

        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {

            if (hasActiveOffer)
                throw new IllegalStateException(
                        "Coupon cannot be used because some products already have an active offer");

            Coupon coupon = couponService.getValidCoupon(request.getCouponCode());
            discount = coupon.calculateDiscount(itemsTotal);

            order.setCoupon(coupon);
            order.setDiscountAmount(discount);

            couponService.applyCoupon(request.getCouponCode());
        }

        // Final total
        order.setTotalPrice(itemsTotal
                .add(city.getDeliveryPrice())
                .subtract(discount));

        orderRepository.save(order);
        return new PlaceOrderResponse(order.getOrderId(), order.getTotalPrice());
    }

    // ---- UPDATE STATUS ONLY --------------------------------------
    @Transactional
    public OrderSummaryResponse updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findByIdOrThrow(id, "Order");

        validateStatusTransition(order.getStatus(), newStatus);

        order.setStatus(newStatus);

        return OrderMapper.toSummary(order);
    }

    @Transactional
    public String cancelOrder(String orderId, UUID customerId) {
        Order order = orderRepository.findByOrderId(orderId);

        if (!order.getCustomer().getId().equals(customerId))
            throw new AccessDeniedException("You do not own this order");

        if (order.getStatus() != OrderStatus.PENDING)
            throw new IllegalStateException("Only pending orders can be cancelled");

        order.setStatus(OrderStatus.CANCELLED);
        return "Order Cancel Successfully!";
    }

    // ---- DELETE ----------------------------------------------------------
    private static final Set<OrderStatus> DELETABLE_STATUSES = Set.of(OrderStatus.PENDING, OrderStatus.CANCELLED);

    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findByIdOrThrow(id, "Order");

        if (!DELETABLE_STATUSES.contains(order.getStatus()))
            throw new BadRequestException("Only pending or cancelled orders can be deleted");

        orderRepository.delete(order);
    }

    // ---- HELPERS ---------------------------------------------------------
    private String generateUniqueOrderId() {
        String orderId;
        int attempts = 0;
        final int MAX_ATTEMPTS = 10;

        do {
            orderId = "ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            attempts++;
        } while (orderRepository.existsByOrderId(orderId) && attempts < MAX_ATTEMPTS);

        if (attempts >= MAX_ATTEMPTS)
            throw new RuntimeException("Failed to generate unique order id after " + MAX_ATTEMPTS + " attempts");

        return orderId;
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus newStatus) {

        Map<OrderStatus, Set<OrderStatus>> allowedTransitions = Map.of(
                OrderStatus.PENDING, Set.of(
                        OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.DELIVERED, OrderStatus.CANCELLED),
                OrderStatus.CONFIRMED, Set.of(OrderStatus.PROCESSING, OrderStatus.DELIVERED, OrderStatus.CANCELLED),
                OrderStatus.PROCESSING, Set.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED),
                OrderStatus.DELIVERED, Set.of(OrderStatus.RETURNED),
                OrderStatus.CANCELLED, Set.of(),
                OrderStatus.RETURNED, Set.of());

        Set<OrderStatus> allowed = allowedTransitions.get(current);

        if (allowed == null || !allowed.contains(newStatus)) {
            throw new BadRequestException(
                    "Cannot change order status from " + current + " to " + newStatus);
        }
    }

}