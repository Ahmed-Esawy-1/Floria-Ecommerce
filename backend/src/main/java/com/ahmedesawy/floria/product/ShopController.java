package com.ahmedesawy.floria.product;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.product.dto.request.ProductFilterRequest;
import com.ahmedesawy.floria.product.dto.response.ProductPriceRangeResponse;
import com.ahmedesawy.floria.product.dto.response.ProductResponse;
import com.ahmedesawy.floria.product.dto.response.ProductSummaryResponse;

import lombok.RequiredArgsConstructor;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("/shop")
public class ShopController {

    private final ProductService productService;

    // ---- QUERIES --------------------------------------------
    @PostMapping("/products")
    public Page<ProductSummaryResponse> getShopProducts(@RequestBody ProductFilterRequest request, Pageable pageable) {
        return productService.getShopProducts(request, pageable);
    }

    @PostMapping("/products/price-range")
    public ProductPriceRangeResponse getShopPriceRange(@RequestBody ProductFilterRequest request) {
        return productService.getShopPriceRange(request);
    }

    @GetMapping("/product/{id}")
    public ProductResponse getActiveProductById(@PathVariable Long id) {
        return productService.getActiveProductById(id);
    }

    @GetMapping("/product/{id}/related")
    public List<ProductSummaryResponse> getRelatedProducts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "4") int limit) {
        return productService.getRelatedProducts(id, limit);
    }
}
