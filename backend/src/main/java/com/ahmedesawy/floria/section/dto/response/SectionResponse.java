package com.ahmedesawy.floria.section.dto.response;

import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class SectionResponse {
    Long id;
    String nameEn;
    String nameAr;
    String urlVisit;
    List<SectionProductResponse> products;
}
