package com.ahmedesawy.floria.product.dto.request;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class ColorMetaDto {
   private Integer colorId;
   private Long productColorId;
   @JsonProperty("isNew")
   private boolean isNew;
   private List<Long> removeImageIds;
   private List<String> imageOrder;
}