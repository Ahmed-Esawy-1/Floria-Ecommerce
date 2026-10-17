package com.ahmedesawy.floria.product.productOffer;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.product.Product;
import com.ahmedesawy.floria.product.dto.request.FullUpdateRequest;
import com.ahmedesawy.floria.product.productOffer.dto.ProductOfferResponse;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ProductOfferService {
    
    private final ProductOfferRepository productOfferRepository;


    // ---- QUIRES --------------------------------------------------------------------------------
    public List<ProductOfferResponse> getAllOffers() {
        return  productOfferRepository.findAll()
                .stream()
                .map(ProductOfferMapper::toResponse)
                .toList();
    }

    @Transactional
    public List<ProductOfferResponse> getAllNotExpiredOffers() {
        return  productOfferRepository.findAllNotExpired(LocalDateTime.now())
                .stream()
                .map(ProductOfferMapper::toResponse)
                .toList();
    }


    // ---- HELPERS -------------------------------------------------------
    // In Product Service
    @Transactional
    public void updateOffer(Product existing, FullUpdateRequest req) {
        boolean wantsOffer = Boolean.TRUE.equals(req.getHasOffer());
    
        if (!wantsOffer) {
            if (existing.getOffer() != null) {
                productOfferRepository.delete(existing.getOffer());
                existing.setOffer(null);
            }
            return;
        }
    
        if (req.getOffer() == null) {
            throw new IllegalArgumentException("Offer details are required when hasOffer is true");
        }
    
        ProductOffer offer = existing.getOffer();
        if (offer == null) {
            offer = new ProductOffer();
            offer.setProduct(existing);
            existing.setOffer(offer);
        }
    
        offer.setDiscountType(req.getOffer().getDiscountType());
        offer.setDiscountValue(req.getOffer().getDiscountValue());
        offer.setStartAt(req.getOffer().getStartAt());
        offer.setEndAt(req.getOffer().getEndAt());
    
        Boolean isActive = req.getOffer().getIsActive();
        offer.setIsActive(isActive != null ? isActive : true);
    
        offer.validateDateRange();
        offer.validateDiscount();
    }






}
