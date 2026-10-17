package com.ahmedesawy.floria.section.dto.response;

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
public class TrashSectionResponse {
    private Long id;
    private String nameEn;
    private String nameAr;
    private LocalDateTime deletedAt;
}
