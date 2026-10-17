package com.ahmedesawy.floria.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface OrderRepository extends FindOrThrowRepository<Order, Long> {

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    Order findByOrderId(String orderId);

    boolean existsByOrderId(String orderId);

    Page<Order> findByCustomer_Id(UUID customerId, Pageable pageable);

    Page<Order> findByCustomer_IdAndStatus(UUID customerId, OrderStatus status, Pageable pageable);

    // (Recent 5 Orders)
    List<Order> findTop5ByOrderByCreatedAtDesc();

    @Query("""
               SELECT oi.product.id, COUNT(oi.product.id) as orderCount
               FROM OrderItem oi
               GROUP BY oi.product.id
               ORDER BY orderCount DESC
            """)
    List<Object[]> findProductsByOrderCount();

    // Top 5 Most Ordered Products (Top Products)
    @Query("""
               SELECT oi.product.id, oi.product.nameEn, oi.product.nameAr, COUNT(oi.product.id) as orderCount
               FROM OrderItem oi
               GROUP BY oi.product.id, oi.product.nameEn, oi.product.nameAr
               ORDER BY orderCount DESC
            """)
    List<Object[]> findTop5ProductsByOrderCount(Pageable pageable);

    // Number of Orders By Status (ex: 4 Completed, 7 Pending)
    long countByStatus(OrderStatus status);

    // ---- REVENUE (DELIVERED only) -----
    @Query("""
                SELECT COALESCE(SUM(o.totalPrice), 0)
                    FROM Order o
                    WHERE o.status = com.ahmedesawy.floria.order.OrderStatus.DELIVERED
                        AND o.createdAt >= :from
                        AND o.createdAt < :to
            """)
    BigDecimal sumDeliveredRevenueBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

}