package com.ahmedesawy.floria.product.productOffer;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.product.productOffer.dto.ProductOfferResponse;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/products/offers")
@RequiredArgsConstructor
public class ProductOfferController {
    private final ProductOfferService productOfferService;

    // ---- QUIRES -----------------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<ProductOfferResponse>> getAllOffers() {
        return ResponseEntity.ok(productOfferService.getAllOffers());
    }

    @GetMapping("/active")
    public ResponseEntity<List<ProductOfferResponse>> getAllNotExpiredOffers() {
        return ResponseEntity.ok(productOfferService.getAllNotExpiredOffers());
    }

}
