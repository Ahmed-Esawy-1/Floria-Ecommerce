package com.ahmedesawy.floria.product.dto.request;

import java.util.List;

import com.ahmedesawy.floria.product.productOffer.dto.ProductOfferRequest;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class FullUpdateRequest {
   private String nameEn;
   private String nameAr;
   private String descriptionEn;
   private String descriptionAr;
   private Double price;
   private Boolean hasColor;
   private List<Integer> removeCategoryIds;
   private List<Integer> removeOccasionIds;
   private List<Integer> categoryIds;
   private List<Integer> occasionIds;
   private Boolean modeSwitched;
   private List<Long> removeImageIds;
   private List<Long> removeColorIds;
   private List<String> generalImageOrder;
   private Boolean hasOffer;
   @Valid 
   private ProductOfferRequest offer;
}