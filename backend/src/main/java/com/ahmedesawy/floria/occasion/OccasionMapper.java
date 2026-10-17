package com.ahmedesawy.floria.occasion;

import com.ahmedesawy.floria.common.util.ImageUrlResolver;
import com.ahmedesawy.floria.occasion.dto.response.OccasionResponse;
import com.ahmedesawy.floria.occasion.dto.response.OccasionSummaryResponse;
import com.ahmedesawy.floria.occasion.dto.response.TrashOccasionResponse;

public class OccasionMapper {

    // ---- MAIN
    public static OccasionResponse toResponse(Occasion occasion) {
        return OccasionResponse.builder()
                .id(occasion.getId())
                .nameEn(occasion.getNameEn())
                .nameAr(occasion.getNameAr())
                .imageUrl(ImageUrlResolver.resolve("occasions", occasion.getImageUrl()))
                .createdAt(occasion.getCreatedAt())
                .updatedAt(occasion.getUpdatedAt())
                .build();
    }

    // ---- SUMMARY ---------------------------
    public static OccasionSummaryResponse toSummaryResponse(Occasion occasion) {
        return OccasionSummaryResponse.builder()
                .id(occasion.getId())
                .nameEn(occasion.getNameEn())
                .nameAr(occasion.getNameAr())
                .imageUrl(ImageUrlResolver.resolve("occasions", occasion.getImageUrl()))
                .build();
    }

    // ---- TRASH -----------------------------------------
    public static TrashOccasionResponse toTrashResponse(Occasion occasion) {
        return TrashOccasionResponse.builder()
                .id(occasion.getId())
                .nameEn(occasion.getNameEn())
                .nameAr(occasion.getNameAr())
                .imageUrl(ImageUrlResolver.resolve("occasions", occasion.getImageUrl()))
                .deletedAt(occasion.getDeletedAt())
                .build();
    }

}
