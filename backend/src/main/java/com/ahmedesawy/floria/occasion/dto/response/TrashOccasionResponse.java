package com.ahmedesawy.floria.occasion.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class TrashOccasionResponse extends OccasionSummaryResponse {
    private LocalDateTime deletedAt;
}
