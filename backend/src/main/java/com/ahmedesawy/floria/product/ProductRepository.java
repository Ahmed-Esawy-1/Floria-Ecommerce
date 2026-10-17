package com.ahmedesawy.floria.product;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface ProductRepository extends FindOrThrowRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Boolean existsByNameEn(String name);

    Boolean existsByNameAr(String name);

    boolean existsByNameEnAndIdNot(String nameEn, Long id);

    boolean existsByNameArAndIdNot(String nameAr, Long id);

    @Query("select p.id from Product p where p.id in :ids")
    Set<Long> findExistingIds(@Param("ids") Set<Long> ids);

    // ---- Section Product Search
    // ------------------------------------------------------------
    List<Product> findByNameEnContainingIgnoreCaseOrNameArContainingIgnoreCase(String nameEn, String nameAr);

    // ---- Active Products
    // ---------------------------------------------------------------------

    // List<Product> findByDeletedAtIsNullOrderByUpdatedAtDesc();
    Optional<Product> findByIdAndDeletedAtIsNull(Long id);

    List<Product> findByOccasionsIdAndDeletedAtIsNull(Long occasionId);

    @Query("""
               SELECT DISTINCT p FROM Product p
               JOIN p.occasions o
               WHERE p.deletedAt IS NULL
               AND (
                  LOWER(o.nameEn) LIKE LOWER(CONCAT('%', :name, '%'))
                  OR
                  LOWER(o.nameAr) LIKE LOWER(CONCAT('%', :name, '%'))
               )
            """)
    List<Product> findByOccasionNameAndDeletedAtIsNull(@Param("name") String name);

    @Query("""
               SELECT p FROM Product p
               JOIN OrderItem oi ON oi.product = p
               WHERE p.deletedAt IS NULL
               GROUP BY p
               ORDER BY SUM(oi.quantity) DESC
            """)
    List<Product> findBestSellers(Pageable pageable);

    // Find All & Order By Created At For ( RELEASE SECTION )
    List<Product> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // ---- Trash
    // ---------------------------------------------------------------------

    List<Product> findByDeletedAtIsNotNullOrderByUpdatedAtDesc();

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Product p SET p.deletedAt = null WHERE p.id IN :ids")
    void restoreBulk(@Param("ids") List<Long> ids);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Product p SET p.deletedAt = :now WHERE p.id IN :ids")
    void softDeleteBulk(@Param("ids") List<Long> ids, @Param("now") LocalDateTime now);

    Page<Product> findByDeletedAtIsNull(Pageable pageable);

}