package com.ahmedesawy.floria.user.employee;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface EmployeeRepository extends FindOrThrowRepository<Employee, UUID> {

  Page<Employee> findByDeletedAtIsNull(Pageable pageable);

  List<Employee> findByDeletedAtIsNotNull();

  boolean existsByEmailAndIdNot(String email, UUID id);

  Optional<Employee> findByEmail(String email);

  Boolean existsByEmail(String email);

  boolean existsByRoleId(UUID roleId);

  // Restore Bulk
  @Modifying
  @Query("UPDATE Employee u SET u.deletedAt = null WHERE u.id IN :ids")
  void restoreBulk(@Param("ids") List<UUID> ids);

  // Soft Delete Bulk
  @Modifying
  @Query("UPDATE Employee u SET u.deletedAt = :now WHERE u.id IN :ids")
  void softDeleteBulk(@Param("ids") List<UUID> ids, @Param("now") LocalDateTime now);

}
