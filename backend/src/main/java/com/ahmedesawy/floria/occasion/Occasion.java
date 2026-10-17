package com.ahmedesawy.floria.occasion;


import com.ahmedesawy.floria.common.base.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "occasions")
@NoArgsConstructor
@Getter
@Setter
public class Occasion extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(unique = true, nullable = false)
    private String nameEn;
    @Column(unique = true, nullable = false)
    private String nameAr;
    @Column(nullable = true)
    private String imageUrl;
}
