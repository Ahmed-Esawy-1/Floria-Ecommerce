package com.ahmedesawy.floria.product;

import java.util.ArrayList;
import java.util.List;

import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import com.ahmedesawy.floria.color.Color;
import com.ahmedesawy.floria.common.base.BaseEntity;
import com.ahmedesawy.floria.product.images.ProductColorImage;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_color")
@Getter
@Setter
@NoArgsConstructor
public class ProductColor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "color_id")
    private Color color;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false, foreignKey = @ForeignKey(name = "fk_color_product"))
    @JsonBackReference("product-colors")
    private Product product;

    @OneToMany(mappedBy = "productColor", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @JsonManagedReference("color-images")
    private List<ProductColorImage> images = new ArrayList<>();

}