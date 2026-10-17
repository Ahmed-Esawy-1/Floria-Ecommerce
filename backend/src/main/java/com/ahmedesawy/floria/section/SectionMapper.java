package com.ahmedesawy.floria.section;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import com.ahmedesawy.floria.product.Product;
import com.ahmedesawy.floria.product.ProductMapper;
import com.ahmedesawy.floria.section.dto.response.SectionProductResponse;
import com.ahmedesawy.floria.section.dto.response.SectionResponse;
import com.ahmedesawy.floria.section.dto.response.SectionSummaryResponse;
import com.ahmedesawy.floria.section.dto.response.TrashSectionResponse;
import com.ahmedesawy.floria.section.product.SectionProduct;

public class SectionMapper {

    // MAIN RESPONSE
    public static SectionResponse toResponse(Section section, Map<Long, Product> productMap) {
        List<SectionProductResponse> products = section.getProducts()
                .stream()
                .sorted(Comparator.comparingInt(SectionProduct::getSortOrder))
                .map(sp -> productMap.get(sp.getProductId()))
                .filter(Objects::nonNull)
                .map(ProductMapper::toSectionResponse)
                .toList();

        return new SectionResponse(
                section.getId(),
                section.getNameEn(),
                section.getNameAr(),
                section.getUrlVisit(),
                products);
    }

    // TRASH RESPONSE
    public static TrashSectionResponse toTrashResponse(Section section) {
        return TrashSectionResponse.builder()
                .id(section.getId())
                .nameEn(section.getNameEn())
                .nameAr(section.getNameAr())
                .deletedAt(section.getDeletedAt())
                .build();
    }

    // SUMMARY RESPONSE
    public static SectionSummaryResponse toSummaryResponse(Section section) {
        return SectionSummaryResponse.builder()
                .id(section.getId())
                .nameEn(section.getNameEn())
                .nameAr(section.getNameAr())
                .urlVisit(section.getUrlVisit())
                .build();
    }

    // ---- HELPERS
    // ---------------------------------------------------------------------------

    // public static Section toEntity(SectionRequest req) {
    // Section section = new Section();
    // section.setNameEn(req.getNameEn());
    // section.setNameAr(req.getNameAr());
    // section.setUrlVisit(req.getUrlVisit());
    // return section;
    // }
}