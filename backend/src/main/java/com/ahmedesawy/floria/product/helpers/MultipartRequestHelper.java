package com.ahmedesawy.floria.product.helpers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ahmedesawy.floria.product.dto.request.ColorMetaDto;

import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MultipartRequestHelper {

    private final ObjectMapper objectMapper;

    private static final String COLOR_FILE_PREFIX = "color_";

    // Extract Color and its Images Ex: [ {colorId: 1, [...images]} , ]
    public Map<Integer, List<MultipartFile>> extractColorFiles(MultipartHttpServletRequest request) {
        Map<Integer, List<MultipartFile>> result = new HashMap<>();

        request.getMultiFileMap().forEach((partName, files) -> {
            if (partName.startsWith(COLOR_FILE_PREFIX)) {
                try {
                    Integer colorId = Integer.parseInt(partName.substring(COLOR_FILE_PREFIX.length()));
                    result.put(colorId, files);
                } catch (NumberFormatException ignored) {}
            }
        });

        return result;
    }

    // Convert the JSON String into a Java List
    public List<ColorMetaDto> parseColorsMeta(String colorsMeta) {
        try {
            return objectMapper.readValue(colorsMeta, new TypeReference<List<ColorMetaDto>>() {});
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid colorsMeta format: " + e.getMessage());
        }
    }
}