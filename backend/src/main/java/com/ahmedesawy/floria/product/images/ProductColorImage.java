package com.ahmedesawy.floria.product.images;


import com.ahmedesawy.floria.product.ProductColor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.ForeignKey;

@Entity
@Table(name = "product_color_image")
@Getter
@Setter
public class ProductColorImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;
    private Integer sortOrder = 0;

    @ManyToOne
    @JoinColumn(name = "product_color_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_image_color"))
    @JsonBackReference("color-images")
    private ProductColor productColor;
}
