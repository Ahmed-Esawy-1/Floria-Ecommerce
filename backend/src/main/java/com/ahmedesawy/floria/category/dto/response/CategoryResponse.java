package com.ahmedesawy.floria.category.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@SuperBuilder
public class CategoryResponse extends CategorySummaryResponse {
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}