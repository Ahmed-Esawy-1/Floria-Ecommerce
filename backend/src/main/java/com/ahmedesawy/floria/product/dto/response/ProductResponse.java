package com.ahmedesawy.floria.product.dto.response;

import java.util.List;

import com.ahmedesawy.floria.category.dto.response.CategorySimpleResponse;
import com.ahmedesawy.floria.occasion.dto.response.OccasionSimpleResponse;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductResponse extends ProductSummaryResponse {
    private String descriptionEn;
    private String descriptionAr;

    private List<CategorySimpleResponse> categories;
    private List<OccasionSimpleResponse> occasions;

    private List<ProductImageResponse> images;
    private List<ProductColorResponse> productColors;
    private Boolean hasOffer;
    private ProductOfferResponse offer;
}