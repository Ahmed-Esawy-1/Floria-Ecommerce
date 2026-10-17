package com.ahmedesawy.floria.watchlist;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.common.exception.NotFoundException;
import com.ahmedesawy.floria.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.floria.product.Product;
import com.ahmedesawy.floria.product.ProductRepository;
import com.ahmedesawy.floria.watchlist.dto.WatchlistProductResponse;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
@Transactional 
public class WatchlistService {
    private final WatchlistRepository watchlistRepository;
    private final ProductRepository productRepository;

    // ---- QUIRES ---------------------------------------------------------------------
    public List<WatchlistProductResponse> getWatchlistProducts(UUID customerId) {
        return watchlistRepository.findAllByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(WatchlistMapper::toResponse)
                .toList();
    }

    public Set<Long> getWatchlistProductIds(UUID customerId) {
        return watchlistRepository.findProductIdsByCustomerId(customerId);
    }


    // ---- ADD PRODUCT TO WATCHLIST ---------------------------------------
    public String addToWatchlist(UUID customerId, Long productId) {
        if (watchlistRepository.existsByCustomerIdAndProductId(customerId, productId)) 
            throw new ResourceAlreadyExistsException("Product already in watchlist");
        
        Product product = productRepository.findByIdOrThrow(productId, "Product");

        Watchlist entry = Watchlist.builder()
                .customerId(customerId)
                .product(product)
                .build();

        watchlistRepository.save(entry);

        return "Added Successfully!";
    }


    // ---- REMOVE PRODUCT TO WATCHLIST ------------------------------------------------------------------------
    public void removeFromWatchlist(UUID customerId, Long productId) {
        if (!watchlistRepository.existsByCustomerIdAndProductId(customerId, productId)) 
            throw new NotFoundException("Product not in watchlist");
        
        watchlistRepository.deleteByCustomerIdAndProductId(customerId, productId);
    }

}
