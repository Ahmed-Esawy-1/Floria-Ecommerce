package com.ahmedesawy.floria.city;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cities")
@Getter
@Setter
@NoArgsConstructor 
@AllArgsConstructor 
public class City {

    public City(String nameEn, String nameAr, BigDecimal deliveryPrice, Boolean available) {
        this.nameEn = nameEn;
        this.nameAr = nameAr;
        this.deliveryPrice = deliveryPrice;
        this.available = available;
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String nameEn;

    @Column(nullable = false, unique = true)
    private String nameAr;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal deliveryPrice;

    @Column(nullable = false)
    private Boolean available;

    @CreationTimestamp 
    private LocalDateTime createdAt;
    
}
