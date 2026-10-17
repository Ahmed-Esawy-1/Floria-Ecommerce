package com.ahmedesawy.floria.product.images;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ahmedesawy.floria.color.Color;
import com.ahmedesawy.floria.color.ColorRepository;
import com.ahmedesawy.floria.common.storage.FileStorageService;
import com.ahmedesawy.floria.product.Product;
import com.ahmedesawy.floria.product.ProductColor;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final FileStorageService fileStorageService;
    private final ColorRepository colorRepository;

    // ---- GENERAL IMAGES ----------------------------------------------------

    public void saveGeneralImages(Product product, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return;
        int sort = 0;
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            ProductImage img = new ProductImage();
            img.setImageUrl(fileStorageService.uploadImage(file, "products"));
            img.setProduct(product);
            img.setSortOrder(sort++);
            product.getImages().add(img);
        }
    }

    public void applyGeneralImageOrder(
        Product product,
        List<MultipartFile> newFiles,
        List<String> orderTokens
    ) {
        if (orderTokens == null || orderTokens.isEmpty()) {
            int sort = product.getImages()
                    .stream()
                    .mapToInt(ProductImage::getSortOrder)
                    .max().orElse(-1) + 1;
            for (MultipartFile file : newFiles) {
                if (file == null || file.isEmpty()) continue;
                ProductImage img = new ProductImage();
                img.setImageUrl(fileStorageService.uploadImage(file, "products"));
                img.setProduct(product);
                img.setSortOrder(sort++);
                product.getImages().add(img);
            }
            return;
        }

        Map<Long, ProductImage> existingById = product.getImages().stream()
                .collect(Collectors.toMap(ProductImage::getId, i -> i));

        List<MultipartFile> cleanFiles = 
                newFiles == null
                    ? List.of()
                    : newFiles.stream().filter(f -> f != null && !f.isEmpty()).toList();

        int newFileCursor = 0;
        int sort = 0;

        for (String token : orderTokens) {
            if (token.startsWith("existing:")) {
                Long id = Long.parseLong(token.substring("existing:".length()));
                ProductImage img = existingById.get(id);
                if (img != null) img.setSortOrder(sort++);
            } else if (token.startsWith("new:")) {
                if (newFileCursor < cleanFiles.size()) {
                    MultipartFile file = cleanFiles.get(newFileCursor++);
                    ProductImage img = new ProductImage();
                    img.setImageUrl(fileStorageService.uploadImage(file, "products"));
                    img.setProduct(product);
                    img.setSortOrder(sort++);
                    product.getImages().add(img);
                }
            }
        }
    }

    // ---- COLOR VARIANTS -----------------------------------------------------

    public void saveColorVariants(Product product, Map<Integer, List<MultipartFile>> colorFilesMap) {
        if (colorFilesMap == null || colorFilesMap.isEmpty()) return;

        for (Map.Entry<Integer, List<MultipartFile>> entry : colorFilesMap.entrySet()) {
            Integer colorId = entry.getKey();
            List<MultipartFile> files = entry.getValue();

            if (files == null || files.stream().noneMatch(f -> f != null && !f.isEmpty())) 
                throw new IllegalArgumentException("At least one image is required for color id: " + colorId);

            Color color = colorRepository.findByIdOrThrow(colorId);

            ProductColor productColor = new ProductColor();
            productColor.setProduct(product);
            productColor.setColor(color);

            int sort = 0;
            for (MultipartFile file : files) {
                if (file == null || file.isEmpty()) continue;
                ProductColorImage img = new ProductColorImage();
                img.setImageUrl(fileStorageService.uploadImage(file, "products"));
                img.setSortOrder(sort++);
                img.setProductColor(productColor);
                productColor.getImages().add(img);
            }

            product.getProductColors().add(productColor);
        }
    }

    public void applyColorImageOrder(
        ProductColor pc,
        List<MultipartFile> newFiles,
        List<String> orderTokens
    ) {
        if (orderTokens == null || orderTokens.isEmpty()) {
            int sort = pc.getImages()
                    .stream()
                    .mapToInt(ProductColorImage::getSortOrder)
                    .max().orElse(-1) + 1;
            for (MultipartFile file : newFiles) {
                if (file == null || file.isEmpty()) continue;
                ProductColorImage img = new ProductColorImage();
                img.setImageUrl(fileStorageService.uploadImage(file, "products"));
                img.setSortOrder(sort++);
                img.setProductColor(pc);
                pc.getImages().add(img);
            }
            return;
        }

        Map<Long, ProductColorImage> existingById = pc.getImages()
                .stream()
                .filter(i -> i.getId() != null)
                .collect(Collectors.toMap(ProductColorImage::getId, i -> i));

        List<MultipartFile> cleanFiles = 
                newFiles == null 
                    ? List.of() 
                    : newFiles.stream().filter(f -> f != null && !f.isEmpty()).toList();

        int newFileCursor = 0;
        int sort = 0;

        for (String token : orderTokens) {
            if (token.startsWith("existing:")) {
                Long id = Long.parseLong(token.substring("existing:".length()));
                ProductColorImage img = existingById.get(id);
                if (img != null) img.setSortOrder(sort++);
            } else if (token.startsWith("new:")) {
                if (newFileCursor < cleanFiles.size()) {
                    MultipartFile file = cleanFiles.get(newFileCursor++);
                    ProductColorImage img = new ProductColorImage();
                    img.setImageUrl(fileStorageService.uploadImage(file, "products"));
                    img.setSortOrder(sort++);
                    img.setProductColor(pc);
                    pc.getImages().add(img);
                }
            }
        }
    }

    // ReOrder Images Before Send n update
    public void resortImagesInMemory(Product product) {
        if(product.getHasColor()) {
            product.getProductColors().forEach(pc ->
                pc.getImages().sort(Comparator.comparing(ProductColorImage::getSortOrder))
            );
        } else {
            product.getImages().sort(Comparator.comparing(ProductImage::getSortOrder));
        }
        
        
    }
}