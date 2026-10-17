package com.ahmedesawy.floria.user.customer;

import java.util.Optional;
import java.util.UUID;

import com.ahmedesawy.floria.common.base.FindOrThrowRepository;

public interface CustomerRepository extends FindOrThrowRepository<Customer, UUID> {
    Optional<Customer> findByEmail(String email);
    boolean existsByEmail(String email);
}
