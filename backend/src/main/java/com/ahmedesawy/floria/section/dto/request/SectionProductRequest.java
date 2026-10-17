package com.ahmedesawy.floria.section.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionProductRequest {
   @NotNull(message = "Product id can't be null")
   Long productId;
   Integer sortOrder;
}