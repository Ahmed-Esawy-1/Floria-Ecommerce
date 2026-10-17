package com.ahmedesawy.floria.section.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionRequest {

   @NotBlank(message = "English name can't be empty")
   String nameEn;

   @NotBlank(message = "Arabic name can't be empty")
   String nameAr;

   String urlVisit;

   @NotNull (message = "Products can't be null")
   @Valid
   List<SectionProductRequest> products;

}
