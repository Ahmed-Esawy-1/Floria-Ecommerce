package com.ahmedesawy.floria.common.base;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BaseEntity {
   @CreationTimestamp
   @Column(nullable = false, updatable = false)
   private LocalDateTime createdAt;
   @UpdateTimestamp
   private LocalDateTime updatedAt;
   private LocalDateTime deletedAt;
}

