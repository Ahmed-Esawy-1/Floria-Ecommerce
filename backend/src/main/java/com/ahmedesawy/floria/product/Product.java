package com.ahmedesawy.floria.product;

import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.ahmedesawy.floria.category.Category;
import com.ahmedesawy.floria.common.base.BaseEntity;
import com.ahmedesawy.floria.occasion.Occasion;
import com.ahmedesawy.floria.product.images.ProductImage;
import com.ahmedesawy.floria.product.productOffer.ProductOffer;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@NoArgsConstructor
@Getter
@Setter
public class Product extends BaseEntity {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, unique = true)
   private String nameEn;

   @Column(nullable = false, unique = true)
   private String nameAr;

   @Column(columnDefinition = "TEXT")
   private String descriptionEn;

   @Column(columnDefinition = "TEXT")
   private String descriptionAr;

   @Column(nullable = false, precision = 10, scale = 2)
   private BigDecimal price;

   @Column(nullable = false)
   private Boolean hasColor = false;

   @ManyToMany
   @JoinTable(name = "product_categories", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
   private Set<Category> categories = new HashSet<>();

   @ManyToMany
   @JoinTable(name = "product_occasions", joinColumns = @JoinColumn(name = "product_id"), inverseJoinColumns = @JoinColumn(name = "occasion_id"))
   private Set<Occasion> occasions = new HashSet<>();

   @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
   @OrderBy("sortOrder ASC")
   private List<ProductImage> images = new ArrayList<>();

   @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
   @OrderBy("id ASC")
   private List<ProductColor> productColors = new ArrayList<>();

   @OneToOne(mappedBy = "product", cascade = CascadeType.ALL)
   private ProductOffer offer;

}
