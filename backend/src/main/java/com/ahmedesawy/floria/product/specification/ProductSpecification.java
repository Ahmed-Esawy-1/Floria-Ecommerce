package com.ahmedesawy.floria.product.specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.ahmedesawy.floria.product.Product;
import com.ahmedesawy.floria.product.dto.request.ProductFilterRequest;
import com.ahmedesawy.floria.product.productOffer.ProductOffer;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public final class ProductSpecification {

    private ProductSpecification() {
    }

    /** Full shop filter: facets + price after discount + sorting. */
    public static Specification<Product> filter(ProductFilterRequest request) {
        return (root, query, cb) -> {
            Join<Product, ProductOffer> offer = ProductPricing.joinUsableOffer(root, cb);

            List<Predicate> predicates = facetPredicates(root, query, cb, offer, request);

            // Price filters use the discounted price, not the original one
            Expression<BigDecimal> price = ProductPricing.effectivePrice(root, offer, cb);
            if (request.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(price, request.getMinPrice()));
            }
            if (request.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(price, request.getMaxPrice()));
            }

            ProductSorting.apply(root, query, cb, request.getSortBy());

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    /**
     * Every filter except price. Shared by the list query and the price range
     * query,
     * so the range always describes the same set of products the list shows.
     */
    public static List<Predicate> facetPredicates(
            Root<Product> root,
            CriteriaQuery<?> query,
            CriteriaBuilder cb,
            Join<Product, ProductOffer> offer,
            ProductFilterRequest request) {

        List<Predicate> predicates = new ArrayList<>();

        predicates.add(cb.isNull(root.get("deletedAt")));

        if (Boolean.TRUE.equals(request.getOnOffer())) {
            predicates.add(cb.isNotNull(offer.get("id")));
        }
        if (hasValues(request.getCategoryIds())) {
            predicates.add(hasAny(root, query, request.getCategoryIds(), "categories", "id"));
        }
        if (hasValues(request.getOccasionIds())) {
            predicates.add(hasAny(root, query, request.getOccasionIds(), "occasions", "id"));
        }
        if (hasValues(request.getColorIds())) {
            predicates.add(hasAny(root, query, request.getColorIds(), "productColors", "color", "id"));
        }

        return predicates;
    }

    /**
     * product.id IN (select p.id from Product p join p.<relation> where <path> in
     * ids)
     * A subquery (instead of a join on the main root) avoids duplicate rows
     * when a product matches several selected values.
     */
    private static Predicate hasAny(
            Root<Product> root, CriteriaQuery<?> query, List<Integer> ids, String relation, String... path) {

        Subquery<Long> sub = query.subquery(Long.class);
        Root<Product> subRoot = sub.from(Product.class);

        Path<?> target = subRoot.join(relation);
        for (String segment : path) {
            target = target.get(segment);
        }

        sub.select(subRoot.get("id")).where(target.in(ids));
        return root.get("id").in(sub);
    }

    private static boolean hasValues(List<?> list) {
        return list != null && !list.isEmpty();
    }
}