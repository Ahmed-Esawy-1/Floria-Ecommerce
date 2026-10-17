package com.ahmedesawy.floria.product.productOffer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductOfferRepository extends JpaRepository<ProductOffer, Long> {



    @Query("""
    SELECT po FROM ProductOffer po
    WHERE po.product.id IN :productIds
      AND po.isActive = true
      AND po.startAt <= :now
      AND po.endAt >= :now
    """)
List<ProductOffer> findActiveOffersByProductIds(
        @Param("productIds") List<Long> productIds,
        @Param("now") LocalDateTime now
);

    @Query("""
        SELECT o FROM ProductOffer o
        WHERE o.isActive = true
        AND o.startAt <= :now
        AND o.endAt >= :now
    """)
    List<ProductOffer> findAllNotExpired(@Param("now") LocalDateTime now);

    Optional<ProductOffer> findByProductId(Long productId);
}
