package com.ahmedesawy.floria.section;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.common.exception.BadRequestException;
import com.ahmedesawy.floria.common.exception.NotFoundException;
import com.ahmedesawy.floria.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.floria.order.OrderRepository;
import com.ahmedesawy.floria.product.Product;
import com.ahmedesawy.floria.product.ProductMapper;
import com.ahmedesawy.floria.product.ProductRepository;
import com.ahmedesawy.floria.product.dto.response.ProductSummaryResponse;
import com.ahmedesawy.floria.section.dto.request.SectionProductRequest;
import com.ahmedesawy.floria.section.dto.request.SectionRequest;
import com.ahmedesawy.floria.section.dto.request.SectionUpdateRequest;
import com.ahmedesawy.floria.section.dto.response.SectionProductResponse;
import com.ahmedesawy.floria.section.dto.response.SectionResponse;
import com.ahmedesawy.floria.section.dto.response.SectionSummaryResponse;
import com.ahmedesawy.floria.section.dto.response.TrashSectionResponse;
import com.ahmedesawy.floria.section.product.SectionProduct;
import com.ahmedesawy.floria.section.product.SectionProductRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SectionService {

    private static final int MAX_PRODUCTS = 15;
    private static final int MIN_PRODUCTS = 5;

    private final SectionRepository sectionRepository;
    private final SectionProductRepository sectionProductRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // ---- QUERIES
    // -----------------------------------------------------------------------------------------
    public List<SectionResponse> getDashboardSections() {
        List<Section> sections = sectionRepository
                .findAllByDeletedAtIsNullAndTypeOrderByUpdatedAtDesc(SectionType.MANUAL);
        return toResponseList(sections);
    }

    public List<TrashSectionResponse> getTrashSections() {
        return sectionRepository.findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc()
                .stream()
                .map(SectionMapper::toTrashResponse)
                .toList();
    }

    public SectionResponse getSectionById(Long id) {
        Section existing = sectionRepository.findByIdOrThrow(id);
        return toResponse(existing);
    }

    public List<SectionProductResponse> searchProductsByName(String name) {
        return productRepository.findByNameEnContainingIgnoreCaseOrNameArContainingIgnoreCase(name, name)
                .stream()
                .map(ProductMapper::toSectionResponse)
                .toList();
    }

    // ---- SHOP
    // -------------------------------------------------------------------------------
    @Transactional
    public List<SectionSummaryResponse> getSectionSummaries() {
        List<SectionSummaryResponse> ordered = new ArrayList<>();

        sectionRepository.findByTypeAndDeletedAtIsNull(SectionType.BEST_SELLER)
                .ifPresent(s -> ordered.add(SectionMapper.toSummaryResponse(s)));

        List<SectionSummaryResponse> others = sectionRepository
                .findAllByDeletedAtIsNullAndTypeOrderByUpdatedAtDesc(SectionType.MANUAL)
                .stream()
                .map(SectionMapper::toSummaryResponse)
                .toList();
        ordered.addAll(others);

        sectionRepository.findByTypeAndDeletedAtIsNull(SectionType.RELEASE)
                .ifPresent(s -> ordered.add(SectionMapper.toSummaryResponse(s)));

        return ordered;
    }

    @Transactional
    public List<ProductSummaryResponse> getSectionProducts(Long id) {
        Section section = sectionRepository.findByIdOrThrow(id);

        // RELEASE SECTION
        if (section.getType() == SectionType.RELEASE) {
            return productRepository
                    .findAllByOrderByCreatedAtDesc(PageRequest.of(0, MAX_PRODUCTS))
                    .stream()
                    .map(ProductMapper::toSummaryResponse)
                    .toList();
        }

        // BESTSELLER SECTION
        if (section.getType() == SectionType.BEST_SELLER) {
            List<Long> topIds = orderRepository.findProductsByOrderCount()
                    .stream()
                    .limit(MAX_PRODUCTS)
                    .map(row -> (Long) row[0])
                    .toList();

            Map<Long, Product> productMap = productRepository.findAllById(topIds)
                    .stream()
                    .collect(Collectors.toMap(Product::getId, Function.identity()));

            return topIds.stream()
                    .map(productMap::get)
                    .filter(Objects::nonNull)
                    .map(ProductMapper::toSummaryResponse)
                    .toList();
        }

        // MANUAL SECTION
        List<SectionProduct> sectionProducts = sectionProductRepository.findBySectionIdOrderBySortOrderAsc(id);

        List<Long> productIds = sectionProducts.stream()
                .map(SectionProduct::getProductId)
                .toList();

        Map<Long, Product> productMap = productRepository.findAllById(productIds)
                .stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        return sectionProducts.stream()
                .map(sp -> productMap.get(sp.getProductId()))
                .filter(Objects::nonNull)
                .map(ProductMapper::toSummaryResponse)
                .toList();
    }

    // ---- CREATE
    // -------------------------------------------------------------------------------------
    @Transactional
    public String addSection(SectionRequest req) {

        if (sectionRepository.existsByNameEn(req.getNameEn().trim()))
            throw new ResourceAlreadyExistsException("The section English name already exists.");

        if (sectionRepository.existsByNameAr(req.getNameAr().trim()))
            throw new ResourceAlreadyExistsException("The section Arabic name already exists.");

        Section section = new Section();
        section.setNameEn(req.getNameEn().trim());
        section.setNameAr(req.getNameAr().trim());
        section.setUrlVisit(req.getUrlVisit());

        List<SectionProductRequest> incoming = req.getProducts() != null
                ? req.getProducts()
                : Collections.emptyList();

        if (incoming.size() < MIN_PRODUCTS)
            throw new BadRequestException("Section cannot have less than " + MIN_PRODUCTS + " products");

        if (incoming.size() > MAX_PRODUCTS)
            throw new BadRequestException("Section cannot have more than " + MAX_PRODUCTS + " products");

        List<Long> ids = incoming.stream()
                .map(SectionProductRequest::getProductId)
                .toList();

        // No duplicate product ids
        Set<Long> uniqueIds = new LinkedHashSet<>(ids);
        if (uniqueIds.size() != ids.size()) {
            Set<Long> seen = new HashSet<>();
            Set<Long> duplicates = ids.stream()
                    .filter(pid -> !seen.add(pid))
                    .collect(Collectors.toSet());
            throw new BadRequestException("Duplicate products in section: " + duplicates);
        }

        // Each product must be exist
        Set<Long> existingIds = productRepository.findExistingIds(uniqueIds);
        if (existingIds.size() != uniqueIds.size()) {
            Set<Long> missing = new LinkedHashSet<>(uniqueIds);
            missing.removeAll(existingIds);
            throw new NotFoundException("Products not found: " + missing);
        }

        List<SectionProduct> products = new ArrayList<>();
        int order = 1;
        for (SectionProductRequest p : incoming) {
            SectionProduct sp = new SectionProduct();
            sp.setProductId(p.getProductId());
            sp.setSortOrder(order++);
            sp.setSection(section);
            products.add(sp);
        }
        section.setProducts(products);

        sectionRepository.save(section);
        return "Section Created Successfully.";
    }

    // ---- UPDATE -------------------------------------------------------------
    @Transactional
    public SectionResponse updateSection(Long id, SectionUpdateRequest req) {
        Section section = sectionRepository.findByIdOrThrow(id);

        if (req.getNameEn() != null) {
            String nameEn = req.getNameEn().trim();
            if (sectionRepository.existsByNameEnAndIdNot(nameEn, id))
                throw new ResourceAlreadyExistsException("The section English name already exists.");
            section.setNameEn(nameEn);
        }

        if (req.getNameAr() != null) {
            String nameAr = req.getNameAr().trim();
            if (sectionRepository.existsByNameArAndIdNot(nameAr, id))
                throw new ResourceAlreadyExistsException("The section Arabic name already exists.");
            section.setNameAr(nameAr);
        }

        if (req.getUrlVisit() != null)
            section.setUrlVisit(req.getUrlVisit());

        if (req.getRemovedProductIds() != null) {
            section.getProducts()
                    .removeIf(sp -> req.getRemovedProductIds().contains(sp.getProductId()));
        }

        if (req.getProducts() != null) {

            List<SectionProductRequest> incoming = req.getProducts();

            if (incoming.size() < MIN_PRODUCTS)
                throw new BadRequestException("Section cannot have less than " + MIN_PRODUCTS + " products");

            if (incoming.size() > MAX_PRODUCTS)
                throw new BadRequestException("Section cannot have more than " + MAX_PRODUCTS + " products");

            List<Long> ids = incoming.stream()
                    .map(SectionProductRequest::getProductId)
                    .toList();

            // No duplicate product ids
            Set<Long> uniqueIds = new LinkedHashSet<>(ids);
            if (uniqueIds.size() != ids.size()) {
                Set<Long> seen = new HashSet<>();
                Set<Long> duplicates = ids.stream()
                        .filter(pid -> !seen.add(pid))
                        .collect(Collectors.toSet());
                throw new BadRequestException("Duplicate products in section: " + duplicates);
            }

            // Each product must be exist
            Set<Long> existingIds = productRepository.findExistingIds(uniqueIds);
            if (existingIds.size() != uniqueIds.size()) {
                Set<Long> missing = new LinkedHashSet<>(uniqueIds);
                missing.removeAll(existingIds);
                throw new NotFoundException("Products not found: " + missing);
            }

            section.getProducts().removeIf(sp -> !uniqueIds.contains(sp.getProductId()));

            int order = 1;
            for (SectionProductRequest p : incoming) {
                SectionProduct existing = section.getProducts()
                        .stream()
                        .filter(sp -> Objects.equals(sp.getProductId(), p.getProductId()))
                        .findFirst()
                        .orElse(null);

                if (existing != null) {
                    existing.setSortOrder(order++);
                } else {
                    SectionProduct sp = new SectionProduct();
                    sp.setProductId(p.getProductId());
                    sp.setSortOrder(order++);
                    sp.setSection(section);
                    section.getProducts().add(sp);
                }
            }
        } else if (req.getRemovedProductIds() != null && section.getProducts().size() < MIN_PRODUCTS) {
            throw new BadRequestException("Section cannot have less than " + MIN_PRODUCTS + " products");
        }

        Section saved = sectionRepository.save(section);
        return toResponse(saved);
    }

    // ---- SINGLE OPERATIONS
    // ---------------------------------------------------------------------
    public void restore(Long id) {
        Section section = sectionRepository.findByIdOrThrow(id);
        section.setDeletedAt(null);
        sectionRepository.save(section);
    }

    public void softDelete(Long id) {
        Section section = sectionRepository.findByIdOrThrow(id);
        section.setDeletedAt(LocalDateTime.now());
        sectionRepository.save(section);
    }

    public void hardDelete(Long id) {
        if (!sectionRepository.existsById(id))
            throw new EntityNotFoundException("Section Not Found.");
        sectionRepository.deleteById(id);
    }

    // ---- BULK OPERATIONS
    // ---------------------------------------------------------------------
    @Transactional
    public void restoreBulk(List<Long> ids) {
        sectionRepository.restoreBulk(ids);
    }

    @Transactional
    public void softDeleteBulk(List<Long> ids) {
        sectionRepository.softDeleteBulk(ids, LocalDateTime.now());
    }

    @Transactional
    public void hardDeleteBulk(List<Long> ids) {
        List<Section> sections = sectionRepository.findAllById(ids);
        if (sections.isEmpty())
            throw new NotFoundException("No products found");
        sectionRepository.deleteAll(sections);
    }

    // ---- HELPERS
    // -------------------------------------------------------------------------------------
    public SectionResponse toResponse(Section section) {
        Map<Long, Product> productMap = buildProductMap(List.of(section));
        return SectionMapper.toResponse(section, productMap);
    }

    private List<SectionResponse> toResponseList(List<Section> sections) {
        Map<Long, Product> productMap = buildProductMap(sections);
        return sections.stream()
                .map(s -> SectionMapper.toResponse(s, productMap))
                .toList();
    }

    private Map<Long, Product> buildProductMap(List<Section> sections) {
        List<Long> productIds = sections
                .stream()
                .flatMap(s -> s.getProducts().stream())
                .map(SectionProduct::getProductId)
                .distinct()
                .toList();

        return productRepository.findAllById(productIds)
                .stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));
    }

}