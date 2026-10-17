package com.ahmedesawy.floria.category.dto.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequest {

    @NotBlank(message = "The name of category in english is required")
    private String nameEn;
    
    @NotBlank(message = "The name of category in arabic is required")
    private String nameAr;
    
    private MultipartFile image;
}

