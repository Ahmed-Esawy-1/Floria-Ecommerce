package com.ahmedesawy.floria.section.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionUpdateRequest {
   String nameEn;
   String nameAr;
   String urlVisit;
   @Valid 
   List<SectionProductRequest> products;
   List<Long> removedProductIds;
}