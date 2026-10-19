package com.ahmedesawy.floria.section.product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ahmedesawy.floria.product.Product;

public interface SectionProductRepository extends JpaRepository<SectionProduct, Long> {

    // Get Products By Section Ids & Order By Sort Order
    List<SectionProduct> findBySectionIdOrderBySortOrderAsc(Long sectionId);

    @Query("""
            select p from SectionProduct sp
            join Product p on p.id = sp.productId
            where sp.section.id = :sectionId
            and p.deletedAt is null
            order by sp.sortOrder asc
            """)
    List<Product> findActiveProductsBySectionId(@Param("sectionId") Long sectionId);

}
