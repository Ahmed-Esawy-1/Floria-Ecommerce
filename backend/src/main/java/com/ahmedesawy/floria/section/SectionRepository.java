package com.ahmedesawy.floria.section;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface SectionRepository extends FindOrThrowRepository<Section, Long> {

   Optional<Section> findByNameEn(String nameEn);

   boolean existsByNameEn(String nameEn);

   boolean existsByNameAr(String nameAr);

   boolean existsByNameEnAndIdNot(String nameEn, Long id);

   boolean existsByNameArAndIdNot(String nameAr, Long id);

   Optional<Section> findByType(SectionType type);

   Optional<Section> findByTypeAndDeletedAtIsNull(SectionType type);

   // Active
   public List<Section> findAllByDeletedAtIsNullOrderByUpdatedAtDesc();

   // Trash
   public List<Section> findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc();

   // Find By Type and Active
   List<Section> findAllByDeletedAtIsNullAndTypeOrderByUpdatedAtDesc(SectionType type);

   // Restore Bulk
   @Modifying
   @Query("UPDATE Section s SET s.deletedAt = null WHERE s.id IN :ids")
   void restoreBulk(@Param("ids") List<Long> ids);

   // Soft Delete Bulk
   @Modifying
   @Query("UPDATE Section s SET s.deletedAt = :now WHERE s.id IN :ids")
   void softDeleteBulk(@Param("ids") List<Long> ids, @Param("now") LocalDateTime now);

}