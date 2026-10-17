package com.ahmedesawy.floria.product.helpers;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ProductValidationHelper {

    public void validateGeneralProduct(List<MultipartFile> generalImages, Map<Integer, List<MultipartFile>> colorFilesMap) {
        boolean hasGeneralImages = generalImages != null &&
            generalImages.stream().anyMatch(f -> f != null && !f.isEmpty());

        if (!hasGeneralImages) 
            throw new IllegalArgumentException("General images are required.");
        
        if (colorFilesMap != null && !colorFilesMap.isEmpty()) 
            throw new IllegalArgumentException("Color images are not allowed for general products.");
        
    }

    public void validateColorProduct(List<MultipartFile> generalImages, Map<Integer, List<MultipartFile>> colorFilesMap) {
        if (generalImages != null && generalImages.stream().anyMatch(f -> !f.isEmpty())) 
            throw new IllegalArgumentException("General images are not allowed when hasColor=true.");
        
        if (colorFilesMap == null || colorFilesMap.isEmpty()) {
            throw new IllegalArgumentException("At least one color variant with images is required.");
        }
    }
}