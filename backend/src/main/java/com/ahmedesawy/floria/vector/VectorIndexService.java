package com.ahmedesawy.floria.vector;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.city.City;
import com.ahmedesawy.floria.city.CityRepository;
import com.ahmedesawy.floria.product.Product;
import com.ahmedesawy.floria.product.ProductColor;
import com.ahmedesawy.floria.product.ProductRepository;
import com.ahmedesawy.floria.product.productOffer.ProductOffer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VectorIndexService {

    private final VectorStore vectorStore;
    private final ProductRepository productRepository;
    private final CityRepository cityRepository;

    // ---- PRODUCTS ----------------------------------------------------
    public void upsertProduct(Product product) {
        String docId = docId("product", product.getId());
        String tagsId = docId("product-tags", product.getId());
        vectorStore.delete(List.of(docId, tagsId));

        // Soft-deleted products are not indexed
        if (product.getDeletedAt() != null) {
            return;
        }

        String productId = String.valueOf(product.getId());

        vectorStore.add(List.of(new Document(
                docId,
                buildProductContent(product),
                Map.of(
                        "type", "product",
                        "productId", productId,
                        "available", "true"))));

        String tags = buildProductTagsContent(product);
        if (tags != null) {
            vectorStore.add(List.of(new Document(
                    tagsId,
                    tags,
                    Map.of(
                            "type", "product_tags",
                            "productId", productId,
                            "available", "true"))));
        }
    }

    public void removeProduct(Long productId) {
        vectorStore.delete(List.of(
                docId("product", productId),
                docId("product-tags", productId)));
    }

    // ---- CITIES ------------------------------------------------------
    public void upsertCity(City city) {
        String docId = docId("city", city.getId());
        vectorStore.delete(List.of(docId));

        if (!Boolean.TRUE.equals(city.getAvailable())) {
            return;
        }

        vectorStore.add(List.of(new Document(
                docId,
                buildCityContent(city),
                Map.of(
                        "type", "city",
                        "id", String.valueOf(city.getId()),
                        "available", "true"))));
    }

    public void removeCity(Integer cityId) {
        vectorStore.delete(List.of(docId("city", cityId)));
    }

    // ---- REINDEX -----------------------------------------------------
    @Transactional
    public void reindexAll() {
        productRepository.findAll().forEach(this::upsertProduct);
        cityRepository.findAll().forEach(this::upsertCity);
    }

    // ---- HELPERS -----------------------------------------------------
    private String buildProductContent(Product product) {
        List<String> parts = new ArrayList<>();

        parts.add(String.format("Product: %s / %s.", product.getNameEn(), product.getNameAr()));
        parts.add(String.format("Price: %.2f EGP.", product.getPrice()));

        if (hasText(product.getDescriptionEn())) {
            parts.add(product.getDescriptionEn().trim());
        }
        if (hasText(product.getDescriptionAr())) {
            parts.add(product.getDescriptionAr().trim());
        }

        if (Boolean.TRUE.equals(product.getHasColor())) {
            List<String> colors = product.getProductColors().stream()
                    .map(ProductColor::getColor)
                    .filter(Objects::nonNull)
                    .map(c -> c.getNameEn() + " / " + c.getNameAr())
                    .toList();

            if (!colors.isEmpty()) {
                parts.add("Available colors: " + String.join(", ", colors) + ".");
            }
        }

        // Only active offers that have not expired
        ProductOffer offer = product.getOffer();
        if (offer != null
                && Boolean.TRUE.equals(offer.getIsActive())
                && offer.getEndAt() != null
                && offer.getEndAt().isAfter(LocalDateTime.now())) {
            parts.add(String.format(
                    "Current offer: %s %s, valid until %s.",
                    offer.getDiscountValue(),
                    offer.getDiscountType(),
                    offer.getEndAt()));
        }

        return String.join(" ", parts);
    }

    private String buildProductTagsContent(Product product) {
        List<String> categories = product.getCategories().stream()
                .map(c -> c.getNameEn() + " / " + c.getNameAr())
                .toList();

        List<String> occasions = product.getOccasions().stream()
                .map(o -> o.getNameEn() + " / " + o.getNameAr())
                .toList();

        if (categories.isEmpty() && occasions.isEmpty()) {
            return null;
        }

        return String.format(
                "Product: %s / %s. Categories: %s. Occasions: %s.",
                product.getNameEn(),
                product.getNameAr(),
                categories.isEmpty() ? "none" : String.join(", ", categories),
                occasions.isEmpty() ? "none" : String.join(", ", occasions));
    }

    private String buildCityContent(City city) {
        return String.format(
                "City: %s / %s. Delivery price: %.2f EGP. Delivery is available to this city.",
                city.getNameEn(),
                city.getNameAr(),
                city.getDeliveryPrice());
    }

    private String docId(String type, Object id) {
        return UUID.nameUUIDFromBytes((type + "-" + id).getBytes(StandardCharsets.UTF_8)).toString();
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}