package com.ahmedesawy.floria.coupon;

import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.common.util.CodeGenerator;
import com.ahmedesawy.floria.coupon.dto.CoupounRequest;
import com.ahmedesawy.floria.coupon.dto.SummaryCouponResponse;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@Validated
public class CouponController {

    private final CouponService couponService;

    // ---- QUERIES --------------------------------------------
    @PreAuthorize("hasAuthority('read:coupon')")
    @GetMapping("/coupons")
    public List<SummaryCouponResponse> getAllCoupounsSummary() {
        return couponService.getAllCoupounsSummary();
    }

    @PreAuthorize("hasAuthority('read:coupon')")
    @GetMapping("/coupon/{id}")
    public Coupon getCoupounById(@PathVariable Integer id) {
        return couponService.getCoupounById(id);
    }

    @PreAuthorize("hasAuthority('read:coupon')")
    @GetMapping("/coupon/active/{id}")
    public Coupon getActiveCoupounById(@PathVariable Integer id) {
        return couponService.getActiveCoupounById(id);
    }

    @PreAuthorize("hasAuthority('read:coupon')")
    @GetMapping("/coupon/code/{code}")
    public Coupon getCoupounByCode(@PathVariable String code) {
        return couponService.getCoupounByCode(code);
    }

    // ---- VALIDATE --------------------------------------------
    @GetMapping("/coupon/validate")
    public Coupon validateCode(@NotBlank String code) {
        return couponService.getValidCoupon(code);
    }

    // ---- CREATE --------------------------------------------
    @PreAuthorize("hasAuthority('create:coupon')")
    @PostMapping("/coupon/create")
    public ResponseEntity<String> createCoupoun(@Valid @RequestBody CoupounRequest request) {
        return new ResponseEntity<>(couponService.createCoupoun(request), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAuthority('create:coupon')")
    @PostMapping("/coupon/generate-code")
    public ResponseEntity<String> generateCode() {
        return ResponseEntity.ok(CodeGenerator.generate(10));
    }

    // ---- UPDATE --------------------------------------------
    @PreAuthorize("hasAuthority('update:coupon')")
    @PutMapping("/coupon/update/{id}")
    public ResponseEntity<Coupon> updateCoupoun(@PathVariable Integer id, @Valid @RequestBody CoupounRequest request) {
        return ResponseEntity.ok(couponService.updateCoupoun(id, request));
    }

    // ---- DELETE --------------------------------------------
    @PreAuthorize("hasAuthority('delete:coupon')")
    @DeleteMapping("/coupon/delete/{id}/permanent")
    public ResponseEntity<Void> deleteCoupounPermanently(@PathVariable Integer id) {
        couponService.deleteCoupounPermanently(id);
        return ResponseEntity.noContent().build();
    }

}