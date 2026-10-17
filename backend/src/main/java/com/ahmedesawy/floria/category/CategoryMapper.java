package com.ahmedesawy.floria.category;

import com.ahmedesawy.floria.category.dto.response.CategoryResponse;
import com.ahmedesawy.floria.category.dto.response.CategorySummaryResponse;
import com.ahmedesawy.floria.category.dto.response.TrashCategoryResponse;
import com.ahmedesawy.floria.common.util.ImageUrlResolver;

public class CategoryMapper {

    // ---- MAIN
    public static CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .nameEn(category.getNameEn())
                .nameAr(category.getNameAr())
                .imageUrl(ImageUrlResolver.resolve("categories", category.getImageUrl()))
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    // ---- SUMMARY
    public static CategorySummaryResponse toSummaryResponse(Category category) {
        return CategorySummaryResponse.builder()
                .id(category.getId())
                .nameEn(category.getNameEn())
                .nameAr(category.getNameAr())
                .imageUrl(ImageUrlResolver.resolve("categories", category.getImageUrl()))
                .build();
    }

    // ---- TRASH
    public static TrashCategoryResponse toTrashResponse(Category category) {
        return TrashCategoryResponse.builder()
                .id(category.getId())
                .nameEn(category.getNameEn())
                .nameAr(category.getNameAr())
                .imageUrl(ImageUrlResolver.resolve("categories", category.getImageUrl()))
                .deletedAt(category.getDeletedAt())
                .build();
    }

}
