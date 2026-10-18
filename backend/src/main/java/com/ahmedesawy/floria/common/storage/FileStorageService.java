package com.ahmedesawy.floria.common.storage;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileStorageService {

   private final Cloudinary cloudinary;

   // Upload Image: returns the public URL
   public String uploadImage(MultipartFile file, String folderName) {
      try {
         Map<?, ?> result = cloudinary.uploader().upload(
               file.getBytes(),
               ObjectUtils.asMap("folder", "floria/" + folderName, "resource_type", "image"));
         return (String) result.get("secure_url");
      } catch (Exception e) {
         throw new RuntimeException("Image upload failed", e);
      }
   }

   // Delete Image: expects the stored Cloudinary URL
   public void deleteFile(String url) {
      if (url == null || !url.contains("/upload/"))
         return;
      try {
         String publicId = url.substring(url.indexOf("/upload/") + 8)
               .replaceFirst("^v\\d+/", "")
               .replaceFirst("\\.[^.]+$", "");
         cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
      } catch (Exception ignored) {
      }
   }
}