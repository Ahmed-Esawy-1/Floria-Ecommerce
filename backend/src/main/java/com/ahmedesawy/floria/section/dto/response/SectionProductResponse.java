package com.ahmedesawy.floria.section.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class SectionProductResponse {
    private Long id;
    private String nameEn;
    private String nameAr;
    private String primaryImageUrl;
}
