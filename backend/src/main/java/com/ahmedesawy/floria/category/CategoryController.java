package com.ahmedesawy.floria.category;

import java.util.List;

import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.category.dto.request.CategoryRequest;
import com.ahmedesawy.floria.category.dto.response.CategoryResponse;
import com.ahmedesawy.floria.category.dto.response.CategorySummaryResponse;
import com.ahmedesawy.floria.category.dto.response.TrashCategoryResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@Validated
@RequiredArgsConstructor
public class CategoryController {

   private final CategoryService categoryService;

   // ---- QUIRES --------------------------------------------
   @GetMapping("/categories")
   public List<CategoryResponse> getActiveCategories() {
      return categoryService.getActiveCategories();
   }

   @GetMapping("/categories/summaries")
   public List<CategorySummaryResponse> getActiveCategoriesSummary() {
      return categoryService.getActiveCategoriesSummary();
   }

   @PreAuthorize("hasAuthority('read:category')")
   @GetMapping("/categories/trash")
   public List<TrashCategoryResponse> getTrashCategories() {
      return categoryService.getTrashCategories();
   }

   @PreAuthorize("hasAuthority('read:category')")
   @GetMapping("/category/{id}")
   public CategoryResponse getCategoryById(@PathVariable Integer id) {
      return categoryService.getCategoryById(id);
   }

   // ---- CREATE --------------------------------------------
   @PreAuthorize("hasAuthority('create:category')")
   @PostMapping(value = "/category/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<CategoryResponse> createCategory(@Valid @ModelAttribute CategoryRequest request) {
      return new ResponseEntity<>(categoryService.create(request), HttpStatus.CREATED);
   }

   // ---- UPDATE --------------------------------------------
   @PreAuthorize("hasAuthority('update:category')")
   @PutMapping(value = "/category/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<CategoryResponse> updateCategory(
         @PathVariable Integer id,
         @Valid @ModelAttribute CategoryRequest request) {
      return ResponseEntity.ok(categoryService.update(id, request));
   }

   // ---- SINGLE OPERATIONS --------------------------------------------
   @PreAuthorize("hasAuthority('delete:category')")
   @PatchMapping("/category/restore/{id}")
   public ResponseEntity<Void> restore(@PathVariable Integer id) {
      categoryService.restore(id);
      return ResponseEntity.noContent().build();
   }

   @PreAuthorize("hasAuthority('delete:category')")
   @DeleteMapping("/category/delete/{id}")
   public ResponseEntity<Void> softDelete(@PathVariable Integer id) {
      categoryService.softDelete(id);
      return ResponseEntity.noContent().build();
   }

   @PreAuthorize("hasAuthority('delete:category')")
   @DeleteMapping("/category/delete/{id}/permanent")
   public ResponseEntity<Void> permanentlyDelete(@PathVariable Integer id) {
      categoryService.hardDelete(id);
      return ResponseEntity.noContent().build();
   }

   // ---- BULK OPERATIONS --------------------------------------------
   @PreAuthorize("hasAuthority('delete:category')")
   @PatchMapping("/categories/restore/bulk")
   public ResponseEntity<Void> restoreMany(@RequestBody List<Integer> ids) {
      categoryService.restoreBulk(ids);
      return ResponseEntity.noContent().build();
   }

   @PreAuthorize("hasAuthority('delete:category')")
   @DeleteMapping("/categories/delete/permanent/bulk")
   public ResponseEntity<Void> permanentlyDeleteBulk(@RequestBody List<Integer> ids) {
      categoryService.hardDeleteBulk(ids);
      return ResponseEntity.noContent().build();
   }

}
