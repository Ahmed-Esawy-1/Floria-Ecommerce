package com.ahmedesawy.floria.color;

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
public class TrashColorResponse {
    private Integer id;
    private String nameEn;
    private String nameAr;
    private String hexCode;
    private LocalDateTime deletedAt;
}
