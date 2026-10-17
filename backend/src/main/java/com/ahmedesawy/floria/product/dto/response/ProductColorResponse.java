package com.ahmedesawy.floria.product.dto.response;

import java.util.List;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ProductColorResponse {
   private Long id;
   private Integer colorId;
   private String nameEn;
   private String nameAr;
   private String hexCode;
   private List<ProductColorImageResponse> images;
}
