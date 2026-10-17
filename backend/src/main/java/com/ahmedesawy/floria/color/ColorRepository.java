package com.ahmedesawy.floria.color;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface ColorRepository extends FindOrThrowRepository<Color, Integer> {
   boolean existsByNameEnAndIdNot(String nameEn, Integer id);
   boolean existsByNameArAndIdNot(String nameAr, Integer id);

   public Boolean existsByNameEn(String name);
   public Boolean existsByNameAr(String name);

   // Active & Order By UpdatedAt
   public List<Color> findAllByDeletedAtIsNullOrderByUpdatedAtDesc();

   // Inactive & Order By UpdatedAt
   public List<Color> findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc();

   // Restore Bulk
   @Modifying
   @Query("""
      UPDATE Color c
      SET c.deletedAt = null
      WHERE c.id IN :ids
   """)
   void restoreBulk(List<Integer> ids);
}
