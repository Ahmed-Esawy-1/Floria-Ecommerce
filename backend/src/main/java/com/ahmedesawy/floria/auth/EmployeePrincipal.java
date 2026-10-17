package com.ahmedesawy.floria.auth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ahmedesawy.floria.role.Permission;
import com.ahmedesawy.floria.role.Role;
import com.ahmedesawy.floria.user.employee.Employee;

public class EmployeePrincipal implements UserDetails {

    private final Employee employee;

    public EmployeePrincipal(Employee employee) {
        this.employee = employee;
    }

    public UUID getId() {
        return employee.getId();
    }

    public String getEmail() {
        return employee.getEmail();
    }

    public String getRoleName() {
        return employee.getRole().getCode();
    }

    public boolean isEmailVerified() {
        return employee.isEmailVerified();
    }

    public boolean isOwner() {
        return Role.OWNER_CODE.equals(employee.getRole().getCode());
    }

    public Set<Permission> getPermissions() {
        return employee.getRole().getPermissions();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority("ROLE_" + employee.getRole().getCode()));
        employee.getRole().getPermissions()
                .forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission.getPermission())));

        return authorities;
    }

    @Override
    public String getPassword() {
        return employee.getPassword();
    }

    @Override
    public String getUsername() {
        return employee.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return employee.getDeletedAt() == null;
    }
}