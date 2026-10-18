package com.ahmedesawy.floria.user.customer;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface CustomerRepository extends FindOrThrowRepository<Customer, UUID> {
    Optional<Customer> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, UUID id);

    @Query("""
            SELECT c FROM Customer c
            WHERE LOWER(c.userName) LIKE LOWER(CONCAT('%', :q, '%'))
            OR LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%'))
            """)
    Page<Customer> searchByNameOrEmail(@Param("q") String q, Pageable pageable);
}
