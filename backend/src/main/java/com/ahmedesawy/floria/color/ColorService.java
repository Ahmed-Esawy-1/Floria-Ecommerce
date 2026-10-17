package com.ahmedesawy.floria.color;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.common.exception.NotFoundException;
import com.ahmedesawy.floria.common.exception.ResourceAlreadyExistsException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ColorService {
   
   final private ColorRepository colorRepository;

   // ---- QUIRES ---------------------------------------------------------------------------
   public List<Color> getActiveColors() {
      return colorRepository.findAllByDeletedAtIsNullOrderByUpdatedAtDesc();
   }

   public List<TrashColorResponse> getTrashColors() {
      return colorRepository.findAllByDeletedAtIsNotNullOrderByUpdatedAtDesc()
         .stream()
         .map(c ->  TrashColorResponse.builder()
            .id(c.getId())
            .nameEn(c.getNameEn())
            .nameAr(c.getNameAr())
            .hexCode(c.getHexCode())
            .deletedAt(c.getDeletedAt())
            .build()
         )
         .toList();
   }

   public Color getColorById(Integer id) {
      return colorRepository.findByIdOrThrow(id);
   }



   // ---- CREATE ---------------------------------------------------------------------------
   public Color addColor(String nameEn, String nameAr, String hexCode) {

      if(colorRepository.existsByNameEn(nameEn)) 
         throw new ResourceAlreadyExistsException("English name is aleardy Exist!");
      

      if(colorRepository.existsByNameAr(nameAr)) 
         throw new ResourceAlreadyExistsException("Arabic name is aleardy Exist!");
      

      Color newColor = new Color();
      newColor.setNameEn(nameEn);
      newColor.setNameAr(nameAr);
      newColor.setHexCode(hexCode);

      return colorRepository.save(newColor);
   }



   // ---- UPDATE ---------------------------------------------------------------------------
   @Transactional
   public Color updateColor(Integer id, String nameEn, String nameAr, String hexCode) {

      Color existing = colorRepository.findByIdOrThrow(id);

      if (nameEn != null && !nameEn.isBlank()) {
         String trimmedNameEn = nameEn.trim();
     
         if (colorRepository.existsByNameEnAndIdNot(trimmedNameEn, existing.getId())) {
             throw new ResourceAlreadyExistsException("English name already exists! Choose another name.");
         }
     
         existing.setNameEn(trimmedNameEn);
     }
     
     if (nameAr != null && !nameAr.isBlank()) {
         String trimmedNameAr = nameAr.trim();
     
         if (colorRepository.existsByNameArAndIdNot(trimmedNameAr, existing.getId())) {
             throw new ResourceAlreadyExistsException("Arabic name already exists! Choose another name.");
         }
     
         existing.setNameAr(trimmedNameAr);
     }

      if(hexCode != null && !hexCode.isBlank()) {
         existing.setHexCode(hexCode);
      }

      return colorRepository.save(existing);
   }

   // ---- SINGLE OPERATIONS -----------------------------------------------------------------------

   public void restore(Integer id) {
      Color existing = colorRepository.findByIdOrThrow(id);
      existing.setDeletedAt(null);
      colorRepository.save(existing);
   }

   public void softDelete(Integer id) {
      Color existing = colorRepository.findByIdOrThrow(id);
      existing.setDeletedAt(LocalDateTime.now());
      colorRepository.save(existing);
   }

   public void hardDelete(Integer id) {
      if(!colorRepository.existsById(id)) {
         throw new NotFoundException("Color Not Found");
      }
      colorRepository.deleteById(id);
   }

   // ---- BULK OPERATIONS ------------------------------------------------------------------------------------

   @Transactional
   public void restoreBulk(List<Integer> ids) {
      colorRepository.restoreBulk(ids);
   }

   @Transactional
   public void hardDeleteBulk(List<Integer> ids) {
      List<Color> colors = colorRepository.findAllById(ids);
      if (colors.isEmpty()) throw new NotFoundException("No colors Found");
      colorRepository.deleteAll(colors); 
   }


}
