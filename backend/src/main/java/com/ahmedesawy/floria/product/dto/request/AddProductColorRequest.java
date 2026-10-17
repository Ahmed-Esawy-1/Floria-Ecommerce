package com.ahmedesawy.floria.product.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddProductColorRequest {
   private String name;
   private String hexCode;
}