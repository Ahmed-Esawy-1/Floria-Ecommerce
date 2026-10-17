package com.ahmedesawy.floria.section;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.product.dto.response.ProductSummaryResponse;
import com.ahmedesawy.floria.section.dto.request.SectionRequest;
import com.ahmedesawy.floria.section.dto.request.SectionUpdateRequest;
import com.ahmedesawy.floria.section.dto.response.SectionResponse;
import com.ahmedesawy.floria.section.dto.response.SectionSummaryResponse;
import com.ahmedesawy.floria.section.dto.response.TrashSectionResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    // ---- ADMIN QUIRES --------------------------------------------
    @PreAuthorize("hasAuthority('read:section')")
    @GetMapping("/sections")
    public List<SectionResponse> getDashboardSections() {
        return sectionService.getDashboardSections();
    }

    @PreAuthorize("hasAuthority('read:section')")
    @GetMapping("/sections/trash")
    public List<TrashSectionResponse> getTrashSections() {
        return sectionService.getTrashSections();
    }

    @PreAuthorize("hasAuthority('read:section')")
    @GetMapping("/section/{id}")
    public SectionResponse getSectionById(@PathVariable Long id) {
        return sectionService.getSectionById(id);
    }

    // ---- SHOP QUIRES --------------------------------------------
    @GetMapping("/shop/sections/summaries")
    public List<SectionSummaryResponse> getSectionSummaries() {
        return sectionService.getSectionSummaries();
    }

    @GetMapping("/section/{id}/products")
    public List<ProductSummaryResponse> getSectionProducts(@PathVariable Long id) {
        return sectionService.getSectionProducts(id);
    }

    // ---- CREATE --------------------------------------------
    @PreAuthorize("hasAuthority('create:section')")
    @PostMapping("/section/add")
    public ResponseEntity<String> addSection(@RequestBody SectionRequest req) {
        return new ResponseEntity<>(sectionService.addSection(req), HttpStatus.CREATED);
    }

    // ---- UPDATE --------------------------------------------
    @PreAuthorize("hasAuthority('create:section')")
    @PutMapping("/section/update/{id}")
    public ResponseEntity<SectionResponse> updateSection(
            @PathVariable Long id,
            @RequestBody SectionUpdateRequest req) {
        return ResponseEntity.ok(sectionService.updateSection(id, req));
    }

    // ---- SINGLE OPERATIONS --------------------------------------------
    @PreAuthorize("hasAuthority('delete:section')")
    @PatchMapping("/section/restore/{id}")
    public ResponseEntity<Void> restoreSection(@PathVariable Long id) {
        sectionService.restore(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:section')")
    @DeleteMapping("/section/delete/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {
        sectionService.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:section')")
    @DeleteMapping("/section/delete/{id}/permanent")
    public ResponseEntity<Void> hardDelete(@PathVariable Long id) {
        sectionService.hardDelete(id);
        return ResponseEntity.noContent().build();
    }

    // ---- BULK OPERATIONS --------------------------------------------
    @PreAuthorize("hasAuthority('delete:section')")
    @PatchMapping("/sections/restore/bulk")
    public ResponseEntity<Void> restoreBulk(@RequestBody List<Long> ids) {
        sectionService.restoreBulk(ids);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:section')")
    @DeleteMapping("/sections/delete/bulk")
    public ResponseEntity<Void> softDeleteBulk(@RequestBody List<Long> ids) {
        sectionService.softDeleteBulk(ids);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:section')")
    @DeleteMapping("/sections/delete/permanent/bulk")
    public ResponseEntity<Void> hardDeleteBulk(@RequestBody List<Long> ids) {
        sectionService.hardDeleteBulk(ids);
        return ResponseEntity.noContent().build();
    }

}