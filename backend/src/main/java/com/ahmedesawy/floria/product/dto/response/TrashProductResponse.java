package com.ahmedesawy.floria.product.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrashProductResponse {
    private Long id;
    private String nameEn;
    private String nameAr;
    private String imageUrl;
    private LocalDateTime deletedAt;
}
