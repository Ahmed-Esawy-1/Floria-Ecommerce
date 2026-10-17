package com.ahmedesawy.floria.product.specification;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Component;

import com.ahmedesawy.floria.product.Product;
import com.ahmedesawy.floria.product.dto.request.ProductFilterRequest;
import com.ahmedesawy.floria.product.dto.response.ProductPriceRangeResponse;
import com.ahmedesawy.floria.product.productOffer.ProductOffer;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;

/** MIN / MAX of the price after discount, computed in the database. */
@Component
@RequiredArgsConstructor
public class ProductPriceRangeQuery {

    private final EntityManager entityManager;

    public ProductPriceRangeResponse execute(ProductFilterRequest request) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Object[]> query = cb.createQuery(Object[].class);
        Root<Product> root = query.from(Product.class);

        Join<Product, ProductOffer> offer = ProductPricing.joinUsableOffer(root, cb);
        List<Predicate> predicates = ProductSpecification.facetPredicates(root, query, cb, offer, request);
        Expression<BigDecimal> price = ProductPricing.effectivePrice(root, offer, cb);

        query.multiselect(cb.min(price), cb.max(price))
                .where(predicates.toArray(Predicate[]::new));

        Object[] row = entityManager.createQuery(query).getSingleResult();

        // No matching products: min and max are NULL
        if (row[0] == null || row[1] == null) {
            return new ProductPriceRangeResponse(BigDecimal.ZERO, BigDecimal.ZERO);
        }
        return new ProductPriceRangeResponse((BigDecimal) row[0], (BigDecimal) row[1]);
    }
}