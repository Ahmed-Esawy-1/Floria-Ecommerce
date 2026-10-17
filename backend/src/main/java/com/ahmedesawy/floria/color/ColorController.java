package com.ahmedesawy.floria.color;

import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
public class ColorController {

   final private ColorService colorService;

   // ---- QUIRES --------------------------------------------
   @GetMapping("/colors")
   public List<Color> getActiveColors() {
      return colorService.getActiveColors();
   }

   @GetMapping("/colors/trash")
   public List<TrashColorResponse> getTrashColors() {
      return colorService.getTrashColors();
   }

   @GetMapping("/color/{id}")
   public Color getColorById(@PathVariable Integer id) {
      return colorService.getColorById(id);
   }

   // ---- CREATE --------------------------------------------
   @PostMapping("/color/add")
   public Color addColor(@RequestBody Color color) {
      return colorService.addColor(color.getNameEn(), color.getNameAr(), color.getHexCode());
   }

   // ---- UPDATE --------------------------------------------
   @PutMapping("/color/update/{id}")
   public Color updateColor(@PathVariable Integer id, @RequestBody Color color) {
      return colorService.updateColor(id, color.getNameEn(), color.getNameAr(), color.getHexCode());
   }

   // ---- SINGLE OPERATIONS --------------------------------------------
   @PatchMapping("/color/restore/{id}")
   public void restoreColor(@PathVariable Integer id) {
      colorService.restore(id);
   }

   @DeleteMapping("/color/delete/{id}")
   public void deletesoftDeleteColor(@PathVariable Integer id) {
      colorService.softDelete(id);
   }

   @DeleteMapping("/color/delete/{id}/permanent")
   public void permanentlyDelete(@PathVariable Integer id) {
      colorService.hardDelete(id);
   }

   // ---- BULK OPERATIONS --------------------------------------------
   @PatchMapping("/colors/restore/bulk")
   public void restoreBulk(@RequestBody List<Integer> ids) {
      colorService.restoreBulk(ids);
   }

   @DeleteMapping("/colors/delete/permanent/bulk")
   public void permanentlyDeleteBulk(@RequestBody List<Integer> ids) {
      colorService.hardDeleteBulk(ids);
   }

}
