package com.ahmedesawy.floria.category;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.category.dto.request.CategoryRequest;
import com.ahmedesawy.floria.category.dto.response.CategoryResponse;
import com.ahmedesawy.floria.category.dto.response.CategorySummaryResponse;
import com.ahmedesawy.floria.category.dto.response.TrashCategoryResponse;
import com.ahmedesawy.floria.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.floria.common.storage.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

   private final CategoryRepository categoryRepository;
   private final FileStorageService fileStorageService;

   // ---- QUIRES
   // ---------------------------------------------------------------------------------
   public List<CategoryResponse> getActiveCategories() {
      return categoryRepository.findAllByDeletedAtIsNullOrderByUpdatedAtDesc()
            .stream()
            .map(CategoryMapper::toResponse)
            .toList();
   }

   public List<CategorySummaryResponse> getActiveCategoriesSummary() {
      return categoryRepository.findAllByDeletedAtIsNullOrderByCreatedAtDesc()
            .stream()
            .map(CategoryMapper::toSummaryResponse)
            .toList();
   }

   public List<TrashCategoryResponse> getTrashCategories() {
      return categoryRepository.findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc()
            .stream()
            .map(CategoryMapper::toTrashResponse)
            .toList();
   }

   public CategoryResponse getCategoryById(Integer id) {
      Category existing = categoryRepository.findByIdOrThrow(id);
      return CategoryMapper.toResponse(existing);
   }

   // -- CREATE
   // ---------------------------------------------------------------------------------
   @Transactional
   public CategoryResponse create(CategoryRequest request) {

      String nameEn = request.getNameEn().trim();
      String nameAr = request.getNameAr().trim();

      if (categoryRepository.existsByNameEnIgnoreCase(nameEn))
         throw new ResourceAlreadyExistsException("The name of category in english is alerady exist.");

      if (categoryRepository.existsByNameArIgnoreCase(nameAr))
         throw new ResourceAlreadyExistsException("The name of category in arabic is alerady exist.");

      Category category = new Category();
      category.setNameEn(nameEn);
      category.setNameAr(nameAr);

      if (request.getImage() != null && !request.getImage().isEmpty()) {
         category.setImageUrl(fileStorageService.uploadImage(request.getImage(), "categories"));
      }

      return CategoryMapper.toResponse(categoryRepository.save(category));
   }

   // ---- UPDATE
   // --------------------------------------------------------------------------------------
   @Transactional
   public CategoryResponse update(Integer id, CategoryRequest request) {

      Category existing = categoryRepository.findByIdOrThrow(id);

      String nameEn = request.getNameEn().trim();
      String nameAr = request.getNameAr().trim();

      if (categoryRepository.existsByNameEnIgnoreCaseAndIdNot(nameEn, id))
         throw new ResourceAlreadyExistsException("The English category name '" + nameEn + "' already exists");

      if (categoryRepository.existsByNameArIgnoreCaseAndIdNot(nameAr, id))
         throw new ResourceAlreadyExistsException("The Arabic category name '" + nameAr + "' already exists");

      existing.setNameEn(nameEn);
      existing.setNameAr(nameAr);

      // Update image
      if (request.getImage() != null && !request.getImage().isEmpty()) {

         if (existing.getImageUrl() != null) {
            try {
               fileStorageService.deleteFile("categories/" + existing.getImageUrl());
            } catch (Exception e) {
            }
         }

         existing.setImageUrl(fileStorageService.uploadImage(request.getImage(), "categories"));
      }

      return CategoryMapper.toResponse(categoryRepository.save(existing));
   }

   // ---- SINGLE OPERATIONS
   // --------------------------------------------------------------------------------------
   public void restore(Integer id) {
      Category category = categoryRepository.findByIdOrThrow(id);
      category.setDeletedAt(null);
      categoryRepository.save(category);
   }

   public void softDelete(Integer id) {
      Category existing = categoryRepository.findByIdOrThrow(id);
      existing.setDeletedAt(LocalDateTime.now());
      categoryRepository.save(existing);
   }

   public void hardDelete(Integer id) {
      Category existing = categoryRepository.findByIdOrThrow(id);

      if (existing.getImageUrl() != null) {
         try {
            fileStorageService.deleteFile("categories/" + existing.getImageUrl());
         } catch (Exception e) {
         }
      }

      categoryRepository.delete(existing);
   }

   // ---- BULK OPERATIONS
   // --------------------------------------------------------------------------------------
   @Transactional
   public void restoreBulk(List<Integer> ids) {
      categoryRepository.restoreBulk(ids);
   }

   @Transactional
   public void hardDeleteBulk(List<Integer> ids) {
      categoryRepository.deleteAllByIdInBatch(ids);
   }

}