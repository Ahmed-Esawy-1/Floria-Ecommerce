package com.ahmedesawy.floria.watchlist;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.auth.CustomerPrincipal;
import com.ahmedesawy.floria.watchlist.dto.WatchlistProductResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customers/me/watchlist")
@PreAuthorize("hasRole('CUSTOMER')")
public class WatchlistController {
    private final WatchlistService watchlistService;

    // ---- QUIRES --------------------------------------------
    @GetMapping
    public List<WatchlistProductResponse> getWatchlistProducts(@AuthenticationPrincipal CustomerPrincipal principal) {
        return watchlistService.getWatchlistProducts(principal.getId());
    }

    @GetMapping("/ids")
    public Set<Long> getWatchlistProductIds(@AuthenticationPrincipal CustomerPrincipal principal) {
        return watchlistService.getWatchlistProductIds(principal.getId());
    }

    // ---- ADD PRODUCT TO WATCHLIST --------------------------------------------
    @PostMapping("/{productId}/add")
    public ResponseEntity<String> addToWatchlist(
            @AuthenticationPrincipal CustomerPrincipal principal,
            @PathVariable Long productId) {
        return new ResponseEntity<>(
                watchlistService.addToWatchlist(principal.getId(), productId), HttpStatus.CREATED);
    }

    // ---- REMOVE PRODUCT TO WATCHLIST --------------------------------------------
    @DeleteMapping("/{productId}/remove")
    public ResponseEntity<Void> removeFromWatchlist(
            @AuthenticationPrincipal CustomerPrincipal principal,
            @PathVariable Long productId) {
        watchlistService.removeFromWatchlist(principal.getId(), productId);
        return ResponseEntity.noContent().build();
    }

}
