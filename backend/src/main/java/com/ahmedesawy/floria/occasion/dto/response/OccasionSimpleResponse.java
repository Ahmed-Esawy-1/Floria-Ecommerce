package com.ahmedesawy.floria.occasion.dto.response;

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
public class OccasionSimpleResponse {
   private Integer id;
   private String nameEn;
   private String nameAr;
}
