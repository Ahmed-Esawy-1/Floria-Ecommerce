package com.ahmedesawy.floria.dashboard.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class DashboardStatsDTO {

   private long totalCategories;
   private long totalOccasions;
   private long totalProducts;
   private long totalOrders;
   private long deliveredOrders;
   private long pendingOrders;
   private int year;
   private BigDecimal monthlyRevenue;
   private BigDecimal yearlyRevenue;

}