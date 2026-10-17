package com.ahmedesawy.floria.common.storage;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

   @Value("${file.upload-dir}")
   private String uploadDir;

   // Upload Image
   public String uploadImage(MultipartFile file, String folderName) {
      try {
         String folder = uploadDir + "/" + folderName;
         Path uploadPath = Paths.get(folder);

         if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
         }

         String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
         Files.copy(file.getInputStream(), uploadPath.resolve(fileName));

         return fileName;
      } catch (Exception e) {
         throw new RuntimeException(e);
      }
   }

   // Delete Image
   public void deleteFile(String path) {
      if (path == null)
         return;

      try {
         Path oldPath = Paths.get(uploadDir, path);
         Files.deleteIfExists(oldPath);

      } catch (Exception e) {
      }
   }

}
