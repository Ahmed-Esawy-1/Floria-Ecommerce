package com.ahmedesawy.floria.occasion;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.occasion.dto.request.OccasionRequest;
import com.ahmedesawy.floria.occasion.dto.response.OccasionResponse;
import com.ahmedesawy.floria.occasion.dto.response.OccasionSummaryResponse;
import com.ahmedesawy.floria.occasion.dto.response.TrashOccasionResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@Validated
@RequiredArgsConstructor
public class OccasionController {

   private final OccasionService occasionService;

   // ---- QUIRES --------------------------------------------
   @GetMapping("/occasions")
   public List<OccasionResponse> getActiveOccasions() {
      return occasionService.getActiveOccasions();
   }

   @GetMapping("/occasions/summaries")
   public List<OccasionSummaryResponse> getActiveOccasionsSummary() {
      return occasionService.getActiveOccasionsSummary();
   }

   @PreAuthorize("hasAuthority('read:occasion')")
   @GetMapping("/occasions/trash")
   public List<TrashOccasionResponse> getTrashOccaions() {
      return occasionService.getTrashOccasions();
   }

   @PreAuthorize("hasAuthority('read:occasion')")
   @GetMapping("/occasion/{id}")
   public OccasionResponse getOccasionById(@PathVariable Integer id) {
      return occasionService.getOccasionById(id);
   }

   // ---- CREATE --------------------------------------------
   @PreAuthorize("hasAuthority('create:occasion')")
   @PostMapping(value = "/occasion/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<OccasionResponse> createOccasion(@Valid @ModelAttribute OccasionRequest request) {
      return new ResponseEntity<>(occasionService.create(request), HttpStatus.CREATED);
   }

   // ---- UPDATE --------------------------------------------
   @PreAuthorize("hasAuthority('update:occasion')")
   @PutMapping(value = "/occasion/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<OccasionResponse> updateOccasion(
         @PathVariable Integer id,
         @Valid @ModelAttribute OccasionRequest request) {
      return ResponseEntity.ok(occasionService.update(id, request));
   }

   // ---- SINGLE OPERATIONS --------------------------------------------
   @PreAuthorize("hasAuthority('delete:occasion')")
   @PatchMapping("/occasion/restore/{id}")
   public ResponseEntity<Void> restoreOccasion(@PathVariable Integer id) {
      occasionService.restore(id);
      return ResponseEntity.noContent().build();
   }

   @PreAuthorize("hasAuthority('delete:occasion')")
   @DeleteMapping("/occasion/delete/{id}")
   public ResponseEntity<Void> softDelete(@PathVariable Integer id) {
      occasionService.softDelete(id);
      return ResponseEntity.noContent().build();
   }

   @PreAuthorize("hasAuthority('delete:occasion')")
   @DeleteMapping("/occasion/delete/{id}/permanent")
   public ResponseEntity<Void> permanentlyDelete(@PathVariable Integer id) {
      occasionService.hardDelete(id);
      return ResponseEntity.noContent().build();
   }

   // ---- BULK OPERATIONS --------------------------------------------
   @PreAuthorize("hasAuthority('delete:occasion')")
   @PatchMapping("/occasions/restore/bulk")
   public ResponseEntity<Void> restoreBulk(@RequestBody List<Integer> ids) {
      occasionService.restoreBulk(ids);
      return ResponseEntity.noContent().build();
   }

   @PreAuthorize("hasAuthority('delete:occasion')")
   @DeleteMapping("/occasions/delete/permanent/bulk")
   public ResponseEntity<Void> permanentlyDeleteBulk(@RequestBody List<Integer> ids) {
      occasionService.hardDeleteBulk(ids);
      return ResponseEntity.noContent().build();
   }

}
