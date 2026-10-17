package com.ahmedesawy.floria.section;

import java.util.ArrayList;
import java.util.List;

import com.ahmedesawy.floria.common.base.BaseEntity;
import com.ahmedesawy.floria.section.product.SectionProduct;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sections")
@Getter
@Setter
public class Section extends BaseEntity {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, length = 100, unique = true)
   private String nameEn;

   @Column(nullable = false, length = 100, unique = true)
   private String nameAr;

   @Column(length = 255)
   private String urlVisit;

   @Enumerated(jakarta.persistence.EnumType.STRING)
   @Column(nullable = false)
   private SectionType type = SectionType.MANUAL;


   @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
   @OrderBy("sortOrder ASC")
   private List<SectionProduct> products = new ArrayList<>();

}
