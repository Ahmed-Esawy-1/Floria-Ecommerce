package com.ahmedesawy.floria.section.product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface SectionProductRepository extends JpaRepository<SectionProduct, Long> {
   
   // Get Products By Section Ids & Order By Sort Order
   List<SectionProduct> findBySectionIdOrderBySortOrderAsc(Long sectionId);
   
   // int countBySectionId(Long sectionId);
   // void deleteBySectionIdAndProductId(Long sectionId, Long productId);


   // @Modifying
   // @Query("UPDATE SectionProduct sp SET sp.sortOrder = sp.sortOrder + 1 WHERE sp.section.id = :sectionId")
   // void incrementSortOrderForSection(@Param("sectionId") Long sectionId);

   // void deleteBySection_IdAndSortOrderGreaterThan(Long sectionId, Integer sortOrder);
   
}
