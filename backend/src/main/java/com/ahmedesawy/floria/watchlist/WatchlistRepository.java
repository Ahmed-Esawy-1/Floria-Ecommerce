package com.ahmedesawy.floria.watchlist;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findAllByCustomerIdOrderByCreatedAtDesc(UUID customerId);

    boolean existsByCustomerIdAndProductId(UUID customerId, Long productId);
    
    void deleteByCustomerIdAndProductId(UUID customerId, Long productId);

    @Query ("SELECT w.product.id FROM Watchlist w WHERE w.customerId = :customerId")
    Set<Long> findProductIdsByCustomerId(@Param("customerId") UUID customerId);
}
