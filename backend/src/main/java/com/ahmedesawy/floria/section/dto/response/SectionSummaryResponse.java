package com.ahmedesawy.floria.section.dto.response;

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
public class SectionSummaryResponse {
    Long id;
    String nameEn;
    String nameAr;
    String urlVisit;
}