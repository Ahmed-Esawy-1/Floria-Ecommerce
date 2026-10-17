package com.ahmedesawy.floria.dashboard;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.category.CategoryRepository;
import com.ahmedesawy.floria.dashboard.dto.DashboardResponseDTO;
import com.ahmedesawy.floria.dashboard.dto.DashboardStatsDTO;
import com.ahmedesawy.floria.dashboard.dto.LatestOrderDTO;
import com.ahmedesawy.floria.dashboard.dto.TopProductDTO;
import com.ahmedesawy.floria.occasion.OccasionRepository;
import com.ahmedesawy.floria.order.OrderRepository;
import com.ahmedesawy.floria.order.OrderStatus;
import com.ahmedesawy.floria.product.ProductRepository;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CategoryRepository categoryRepository;
    private final OccasionRepository occasionRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public DashboardResponseDTO getDashboardData(Integer year, Integer month) {

        // Each missing param falls back to the current year / month
        YearMonth now = YearMonth.now();
        YearMonth target = YearMonth.of(
                year != null ? year : now.getYear(),
                month != null ? month : now.getMonthValue());

        int targetYear = target.getYear();

        // Date ranges: [start, end)
        LocalDateTime monthStart = target.atDay(1).atStartOfDay();
        LocalDateTime monthEnd = monthStart.plusMonths(1);
        LocalDateTime yearStart = target.withMonth(1).atDay(1).atStartOfDay();
        LocalDateTime yearEnd = yearStart.plusYears(1);

        // Stats
        BigDecimal yearlyRevenue = orderRepository
                .sumDeliveredRevenueBetween(yearStart, yearEnd)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal monthlyRevenue = orderRepository
                .sumDeliveredRevenueBetween(monthStart, monthEnd)
                .setScale(2, RoundingMode.HALF_UP);

        DashboardStatsDTO stats = new DashboardStatsDTO(
                categoryRepository.count(),
                occasionRepository.count(),
                productRepository.count(),
                orderRepository.count(),
                orderRepository.countByStatus(OrderStatus.DELIVERED),
                orderRepository.countByStatus(OrderStatus.PENDING),
                targetYear,
                monthlyRevenue,
                yearlyRevenue);

        // Latest 5 Orders
        List<LatestOrderDTO> latestOrders = orderRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(order -> new LatestOrderDTO(
                        order.getId(),
                        order.getCustomer().getUserName(),
                        order.getTotalPrice(),
                        order.getStatus().name(),
                        order.getCreatedAt()))
                .toList();

        // Top 5 most ordered products
        List<TopProductDTO> topProducts = orderRepository
                .findTop5ProductsByOrderCount(PageRequest.of(0, 5))
                .stream()
                .map(row -> new TopProductDTO(
                        (Long) row[0], // id
                        (String) row[1], // nameEn
                        (String) row[2], // nameAr
                        (Long) row[3])) // orderCount
                .toList();

        return new DashboardResponseDTO(stats, latestOrders, topProducts);
    }
}