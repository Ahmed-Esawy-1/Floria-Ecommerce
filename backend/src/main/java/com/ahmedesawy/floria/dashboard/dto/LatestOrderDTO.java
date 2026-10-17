package com.ahmedesawy.floria.dashboard.dto;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class LatestOrderDTO {

   private Long id;
   private String customerName;
   private BigDecimal total;
   private String status;
   private LocalDateTime createdAt;

}
