package com.ahmedesawy.floria.product.dto.request;

import java.math.BigDecimal;
import java.util.List;

import com.ahmedesawy.floria.product.productOffer.dto.ProductOfferRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProductRequest {

   @NotBlank(message = "The name of product in english is reuired")
   private String nameEn;

   @NotBlank(message = "The name of product in arabic is reuired")
   private String nameAr;

   private String descriptionEn;
   private String descriptionAr;

   @NotNull
   private Boolean hasColor;

   @NotNull
   @Positive(message = "Price should be positive")
   private BigDecimal price;

   private List<Integer> categoryIds;
   private List<Integer> occasionIds;

   @NotNull(message = "Has Offer must be ture of false")
   private Boolean hasOffer;

   @Valid
   private ProductOfferRequest offer;

}
