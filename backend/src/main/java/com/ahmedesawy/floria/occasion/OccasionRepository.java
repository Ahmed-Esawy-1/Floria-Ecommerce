package com.ahmedesawy.floria.occasion;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface OccasionRepository extends FindOrThrowRepository<Occasion, Integer> {

    // ---- EXISTS
    Boolean existsByNameEnIgnoreCase(String name);

    Boolean existsByNameArIgnoreCase(String name);

    Boolean existsByNameEnIgnoreCaseAndIdNot(String nameEn, Integer id);

    Boolean existsByNameArIgnoreCaseAndIdNot(String nameAr, Integer id);
    
    // ---- ACTIVE
    List<Occasion> findAllByDeletedAtIsNullOrderByCreatedAtDesc();
    List<Occasion> findAllByDeletedAtIsNullOrderByUpdatedAtDesc();

    // ---- TREASH
    List<Occasion> findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc();


    // Restore Bulk
    @Modifying
    @Query("""
                UPDATE Occasion o
                SET o.deletedAt = null
                WHERE o.id IN :ids
            """)
    void restoreBulk(List<Integer> ids);

}
