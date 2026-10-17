package com.ahmedesawy.floria.user;

import java.util.UUID;

import com.ahmedesawy.floria.common.base.BaseEntity;

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
public abstract class Account extends BaseEntity {

    private String userName;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String imageUrl;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean emailVerified;

    public abstract UUID getId();
}