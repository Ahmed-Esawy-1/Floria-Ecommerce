package com.ahmedesawy.floria.section.product;

import com.ahmedesawy.floria.section.Section;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "section_product",
   uniqueConstraints = @UniqueConstraint(columnNames = {"section_id", "product_id"}
))
@Getter
@Setter
public class SectionProduct {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "section_id", nullable = false)
   private Section section;

   @Column(name = "product_id", nullable = false)
   private Long productId;

   @Column(name = "sort_order", nullable = false)
   private Integer sortOrder = 0;

}
