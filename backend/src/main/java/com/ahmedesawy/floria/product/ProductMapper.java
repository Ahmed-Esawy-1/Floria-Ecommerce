package com.ahmedesawy.floria.product;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.stream.Stream;

import com.ahmedesawy.floria.category.Category;
import com.ahmedesawy.floria.category.dto.response.CategorySimpleResponse;
import com.ahmedesawy.floria.common.util.ImageUrlResolver;
import com.ahmedesawy.floria.occasion.Occasion;
import com.ahmedesawy.floria.occasion.dto.response.OccasionSimpleResponse;
import com.ahmedesawy.floria.product.dto.response.ProductColorImageResponse;
import com.ahmedesawy.floria.product.dto.response.ProductColorResponse;
import com.ahmedesawy.floria.product.dto.response.ProductImageResponse;
import com.ahmedesawy.floria.product.dto.response.ProductOfferResponse;
import com.ahmedesawy.floria.product.dto.response.ProductResponse;
import com.ahmedesawy.floria.product.dto.response.ProductSearchResponse;
import com.ahmedesawy.floria.product.dto.response.ProductSummaryResponse;
import com.ahmedesawy.floria.product.dto.response.TrashProductResponse;
import com.ahmedesawy.floria.product.images.ProductColorImage;
import com.ahmedesawy.floria.product.images.ProductImage;
import com.ahmedesawy.floria.product.productOffer.ProductOffer;
import com.ahmedesawy.floria.section.dto.response.SectionProductResponse;

public class ProductMapper {

    // ---- MAIN
    public static ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        mapBasicInfo(response, product);
        response.setHasColor(product.getHasColor());

        // Color Variant
        if (Boolean.TRUE.equals(product.getHasColor())) {
            response.setProductColors(
                    safeStream(product.getProductColors())
                            .map(ProductMapper::toColorResponse)
                            .toList());
        } else {
            // General Image
            response.setImages(
                    safeStream(product.getImages())
                            .map(ProductMapper::toImageResponse)
                            .toList());
        }

        response.setHasOffer(product.getOffer() != null);
        if (product.getOffer() != null) {
            ProductOffer offer = product.getOffer();

            ProductOfferResponse offerResponse = new ProductOfferResponse(
                    offer.getDiscountType(),
                    offer.getDiscountValue(),
                    offer.getStartAt(),
                    offer.getEndAt(),
                    offer.getIsActive());

            response.setOffer(offerResponse);
        }

        return response;
    }

    // ---- SUMMARY
    public static ProductSummaryResponse toSummaryResponse(Product product) {
        BigDecimal priceAfterDiscount = product.getOffer() != null && product.getOffer().isUsable()
                ? product.getOffer().calculatePriceAfterDiscount(product.getPrice())
                : null;

        ProductColor firstColor = resolveFirstColor(product);

        return ProductSummaryResponse.builder()
                .id(product.getId())
                .nameEn(product.getNameEn())
                .nameAr(product.getNameAr())
                .price(product.getPrice())
                .primaryImageUrl(resolvePrimaryImage(product))
                .priceAfterDiscount(priceAfterDiscount)
                .hasColor(Boolean.TRUE.equals(product.getHasColor()))
                .colorNameEn(firstColor != null && firstColor.getColor() != null
                        ? firstColor.getColor().getNameEn()
                        : null)
                .colorNameAr(firstColor != null && firstColor.getColor() != null
                        ? firstColor.getColor().getNameAr()
                        : null)
                .build();
    }

    // ---- TRASH
    public static TrashProductResponse toTrashResponse(Product product) {
        return TrashProductResponse.builder()
                .id(product.getId())
                .nameEn(product.getNameEn())
                .nameAr(product.getNameAr())
                .imageUrl(resolvePrimaryImage(product))
                .deletedAt(product.getDeletedAt())
                .build();
    }

    // ---- SEARCH
    public static ProductSearchResponse toSearchResponse(Product product) {
        return ProductSearchResponse.builder()
                .id(product.getId())
                .nameEn(product.getNameEn())
                .nameAr(product.getNameAr())
                .primaryImageUrl(resolvePrimaryImage(product))
                .build();
    }

    // ---- SECTION PRODUCT SEARCH
    public static SectionProductResponse toSectionResponse(Product product) {
        return new SectionProductResponse(
                product.getId(),
                product.getNameEn(),
                product.getNameAr(),
                resolvePrimaryImage(product));
    }

    // ----- HELPERS -------------------------------------
    private static void mapBasicInfo(ProductResponse response, Product product) {
        response.setId(product.getId());
        response.setNameEn(product.getNameEn());
        response.setNameAr(product.getNameAr());
        response.setPrice(product.getPrice());
        response.setDescriptionEn(product.getDescriptionEn());
        response.setDescriptionAr(product.getDescriptionAr());
        response.setPrimaryImageUrl(resolvePrimaryImage(product));

        response.setCategories(
                safeStream(product.getCategories())
                        .map(ProductMapper::toCategorySimple)
                        .toList());

        response.setOccasions(
                safeStream(product.getOccasions())
                        .map(ProductMapper::toOccasionSimple)
                        .toList());

        if (product.getOffer() != null && product.getOffer().isUsable()) {
            response.setPriceAfterDiscount(
                    product.getOffer().calculatePriceAfterDiscount(product.getPrice()));
        }
    }

    // ---- Simple Category
    private static CategorySimpleResponse toCategorySimple(Category category) {
        return new CategorySimpleResponse(
                category.getId(),
                category.getNameEn(),
                category.getNameAr());
    }

    // ---- Simple Occasion
    private static OccasionSimpleResponse toOccasionSimple(Occasion occasion) {
        return new OccasionSimpleResponse(
                occasion.getId(),
                occasion.getNameEn(),
                occasion.getNameAr());
    }

    // ---- The First Color
    private static ProductColor resolveFirstColor(Product product) {
        if (!Boolean.TRUE.equals(product.getHasColor())) {
            return null;
        }
        return safeStream(product.getProductColors())
                .findFirst()
                .orElse(null);
    }

    private static ProductColorResponse toColorResponse(ProductColor color) {
        ProductColorResponse res = new ProductColorResponse();
        res.setId(color.getId());
        res.setColorId(color.getColor().getId());
        res.setNameEn(color.getColor().getNameEn());
        res.setNameAr(color.getColor().getNameAr());
        res.setHexCode(color.getColor().getHexCode());
        res.setImages(
                safeStream(color.getImages())
                        .map(ProductMapper::toColorImageResponse)
                        .toList());
        return res;
    }

    private static ProductImageResponse toImageResponse(ProductImage img) {
        ProductImageResponse res = new ProductImageResponse();
        res.setId(img.getId());
        res.setImageUrl(ImageUrlResolver.resolve("products", img.getImageUrl()));
        return res;
    }

    private static ProductColorImageResponse toColorImageResponse(ProductColorImage img) {
        ProductColorImageResponse res = new ProductColorImageResponse();
        res.setId(img.getId());
        res.setSortOrder(img.getSortOrder());
        res.setImageUrl(ImageUrlResolver.resolve("products", img.getImageUrl()));
        return res;
    }

    // ---- The Primary Image
    public static String resolvePrimaryImage(Product product) {
        if (product.getHasColor()) {
            return safeStream(product.getProductColors())
                    .filter(c -> c.getImages() != null && !c.getImages().isEmpty())
                    .findFirst()
                    .flatMap(c -> c.getImages().stream().findFirst())
                    .map(img -> ImageUrlResolver.resolve("products", img.getImageUrl()))
                    .orElse(null);
        }

        return safeStream(product.getImages())
                .findFirst()
                .map(img -> ImageUrlResolver.resolve("products", img.getImageUrl()))
                .orElse(null);
    }

    private static <T> Stream<T> safeStream(Collection<T> collection) {
        return collection != null ? collection.stream() : Stream.empty();
    }
}