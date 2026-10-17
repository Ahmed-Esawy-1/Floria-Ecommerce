package com.ahmedesawy.floria.role;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    public static final String OWNER_CODE = "OWNER";

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Pattern(regexp = "^[A-Z_]+$", message = "Code must be uppercase letters and underscores only")
    @Column(unique = true, nullable = false)
    private String code;

    @Column(unique = true, nullable = false)
    private String nameEn;

    @Column(unique = true, nullable = false)
    private String nameAr;

    private String descriptionEn;
    private String descriptionAr;

    @ElementCollection(targetClass = Permission.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "permission")
    @Builder.Default
    private Set<Permission> permissions = new HashSet<>();

    public static Role owner() {
        Role role = new Role();
        role.setCode(OWNER_CODE);
        role.setNameEn("Owner");
        role.setNameAr("المالك");
        role.setDescriptionEn("Full system access — bypasses granular permission checks");
        role.setDescriptionAr("صلاحية كاملة على النظام — تتجاوز فحوصات الصلاحيات التفصيلية");
        role.setPermissions(new HashSet<>(Arrays.asList(Permission.values())));
        return role;
    }
}