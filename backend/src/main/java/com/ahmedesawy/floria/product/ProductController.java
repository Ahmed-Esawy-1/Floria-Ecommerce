package com.ahmedesawy.floria.product;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ahmedesawy.floria.product.dto.request.CreateProductRequest;
import com.ahmedesawy.floria.product.dto.request.FullUpdateRequest;
import com.ahmedesawy.floria.product.dto.response.ProductResponse;
import com.ahmedesawy.floria.product.dto.response.ProductSearchResponse;
import com.ahmedesawy.floria.product.dto.response.TrashProductResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@Validated
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ---- QUERIES --------------------------------------------
    @PreAuthorize("hasAuthority('read:product')")
    @GetMapping("/products")
    public Page<ProductResponse> getActiveProducts(
            @PageableDefault(size = 10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return productService.getActiveProducts(pageable);
    }

    @GetMapping("/product/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PreAuthorize("hasAuthority('delete:product')")
    @GetMapping("/products/trash")
    public List<TrashProductResponse> getTrashProducts() {
        return productService.getTrashProducts();
    }

    // ---- SEARCH --------------------------------------------
    @GetMapping("/products/search")
    public ResponseEntity<List<ProductSearchResponse>> searchProducts(@RequestParam String keyword) {
        return new ResponseEntity<>(productService.searchProducts(keyword), HttpStatus.OK);
    }

    // ---- CREATE --------------------------------------------
    @PreAuthorize("hasAuthority('create:product')")
    @PostMapping(value = "/product/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createProduct(
            @Valid @ModelAttribute CreateProductRequest request,
            MultipartHttpServletRequest multipartRequest) {
        return new ResponseEntity<>(productService.createProduct(request, multipartRequest), HttpStatus.CREATED);
    }

    // ---- FULL UPDATE --------------------------------------------
    @PreAuthorize("hasAuthority('update:product')")
    @PutMapping(value = "/product/update/{productId}/full", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> fullUpdate(
            @PathVariable Long productId,
            @RequestPart("data") @Valid FullUpdateRequest request,
            @RequestParam(required = false) String colorsMeta,
            MultipartHttpServletRequest multipartRequest) {
        return ResponseEntity.ok(
                productService.fullUpdate(productId, request, colorsMeta, multipartRequest));
    }

    // ---- SINGLE OPERATIONS --------------------------------------------
    @PreAuthorize("hasAuthority('delete:product')")
    @PatchMapping("/product/restore/{id}")
    public ResponseEntity<Void> restoreProduct(@PathVariable Long id) {
        productService.restore(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:product')")
    @DeleteMapping("/product/delete/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        productService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:product')")
    @DeleteMapping("/product/delete/{id}/permanent")
    public ResponseEntity<Void> hardDelete(@PathVariable Long id) {
        productService.hardDelete(id);
        return ResponseEntity.noContent().build();
    }

    // ---- BULK OPERATIONS --------------------------------------------
    @PreAuthorize("hasAuthority('delete:product')")
    @PatchMapping("/products/restore/bulk")
    public ResponseEntity<Void> restoreBulk(@RequestBody List<Long> ids) {
        productService.restoreBulk(ids);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:product')")
    @DeleteMapping("/products/delete/bulk")
    public ResponseEntity<Void> softDeleteBulk(@RequestBody List<Long> ids) {
        productService.softDeleteBulk(ids);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:product')")
    @DeleteMapping("/products/delete/permanent/bulk")
    public ResponseEntity<Void> hardDeleteBulk(@RequestBody List<Long> ids) {
        productService.hardDeleteBulk(ids);
        return ResponseEntity.noContent().build();
    }

}