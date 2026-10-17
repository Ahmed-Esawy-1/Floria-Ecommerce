package com.ahmedesawy.floria.dashboard.dto;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@AllArgsConstructor
@Getter
@Setter
public class DashboardResponseDTO {

   private DashboardStatsDTO stats;
   private List<LatestOrderDTO> latestOrders;
   private List<TopProductDTO> topProducts;
   
}
