package com.ahmedesawy.floria.category;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface CategoryRepository extends FindOrThrowRepository<Category, Integer> {

    // ---- EXISTS
    Boolean existsByNameEnIgnoreCase(String name);

    Boolean existsByNameArIgnoreCase(String name);

    Boolean existsByNameEnIgnoreCaseAndIdNot(String nameEn, Integer id);

    Boolean existsByNameArIgnoreCaseAndIdNot(String nameAr, Integer id);

    // ---- ACTIVE
    List<Category> findAllByDeletedAtIsNullOrderByCreatedAtDesc();

    List<Category> findAllByDeletedAtIsNullOrderByUpdatedAtDesc();

    // ---- TRASH
    List<Category> findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc();

    // ---- RESTORE
    @Modifying
    @Query("""
                UPDATE Category c
                SET c.deletedAt = null
                WHERE c.id IN :ids
            """)
    void restoreBulk(List<Integer> ids);

}