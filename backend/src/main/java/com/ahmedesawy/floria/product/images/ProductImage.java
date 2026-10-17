package com.ahmedesawy.floria.product.images;

import com.ahmedesawy.floria.product.Product;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "product_images")
@Getter
@Setter
public class ProductImage {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   private String imageUrl;
   @Column(name = "sort_order")
   private Integer sortOrder = 0;

   @ManyToOne
   @JoinColumn(name = "product_id", foreignKey = @ForeignKey(name = "fk_images_product"))
   @JsonBackReference("product-images")
   private Product product;

}