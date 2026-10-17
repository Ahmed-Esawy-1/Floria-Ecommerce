package com.ahmedesawy.floria.order;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.auth.CustomerPrincipal;
import com.ahmedesawy.floria.order.dto.request.OrderRequest;
import com.ahmedesawy.floria.order.dto.response.OrderDetailResponse;
import com.ahmedesawy.floria.order.dto.response.OrderSummaryResponse;
import com.ahmedesawy.floria.order.dto.response.PlaceOrderResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequiredArgsConstructor
@Validated
public class OrderController {

    private final OrderService orderService;

    // ---- QUERIES (ADMIN) --------------------------------------------
    @PreAuthorize("hasAuthority('read:order')")
    @GetMapping("/orders")
    public ResponseEntity<Page<OrderSummaryResponse>> getOrdersSummary(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersSummary(pageable, status));
    }

    @PreAuthorize("hasAuthority('read:order')")
    @GetMapping("/order/{id}")
    public OrderDetailResponse getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PreAuthorize("hasAuthority('read:order')")
    @GetMapping("/order/{id}/summary")
    public OrderSummaryResponse getOrderSummaryById(@PathVariable Long id) {
        return orderService.getOrderSummaryById(id);
    }

    @PreAuthorize("hasAuthority('read:order')")
    @GetMapping("/order/orderId/{orderId}")
    public OrderDetailResponse getOrderById(@PathVariable String orderId) {
        return orderService.getOrderByOrderId(orderId);
    }

    // ---- QUERIES (CUSTOMER) --------------------------------------------
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/shop/orders/my")
    public ResponseEntity<Page<OrderDetailResponse>> getMyOrders(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) OrderStatus status,
            @AuthenticationPrincipal CustomerPrincipal principal) {
        return ResponseEntity.ok(
                orderService.getOrdersForCustomer(principal.getId(), pageable, status));
    }

    // ---- CREATE --------------------------------------------
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/shop/order/place")
    public ResponseEntity<PlaceOrderResponse> placeOrder(
            @Valid @RequestBody OrderRequest request,
            @AuthenticationPrincipal CustomerPrincipal principal) {
        return new ResponseEntity<>(orderService.placeOrder(request, principal.getId()), HttpStatus.CREATED);
    }

    // ---- UPDATE STATUS (ADMIN) --------------------------------------------
    @PreAuthorize("hasAuthority('update:order')")
    @PatchMapping("/order/update/{id}/status")
    public ResponseEntity<OrderSummaryResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody(required = true) OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // ---- CANCEL (CUSTOMER) --------------------------------------------
    @PreAuthorize("hasRole('CUSTOMER')")
    @PatchMapping("/shop/order/{orderId}/cancel")
    public ResponseEntity<String> cancelOrder(
            @PathVariable String orderId,
            @AuthenticationPrincipal CustomerPrincipal principal) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId, principal.getId()));
    }

    // ---- DELETE --------------------------------------------
    @PreAuthorize("hasAuthority('delete:order')")
    @DeleteMapping("/order/delete/{id}/permanent")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}