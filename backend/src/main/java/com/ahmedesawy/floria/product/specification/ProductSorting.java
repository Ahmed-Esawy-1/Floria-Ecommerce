package com.ahmedesawy.floria.product.specification;

import com.ahmedesawy.floria.order.item.OrderItem;
import com.ahmedesawy.floria.product.Product;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public final class ProductSorting {

    public static final String NEWEST = "newest";
    public static final String BEST_SELLERS = "bestSellers";

    private ProductSorting() {
    }

    /**
     * Applies the ordering only on the entity query (not on count or aggregate
     * queries).
     * The id tiebreaker keeps "load more" pagination stable: no duplicates and no
     * gaps.
     */
    public static void apply(Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder cb, String sortBy) {
        if (!Product.class.equals(query.getResultType())) {
            return;
        }

        if (BEST_SELLERS.equals(sortBy)) {
            Subquery<Long> orders = query.subquery(Long.class);
            Root<OrderItem> item = orders.from(OrderItem.class);
            orders.select(cb.count(item)).where(cb.equal(item.get("product"), root));
            query.orderBy(cb.desc(orders), cb.desc(root.get("id")));
        } else if (NEWEST.equals(sortBy)) {
            query.orderBy(cb.desc(root.get("createdAt")), cb.desc(root.get("id")));
        } else {
            query.orderBy(cb.desc(root.get("id")));
        }
    }
}