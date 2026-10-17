package com.ahmedesawy.floria.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ahmedesawy.floria.user.customer.Customer;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class CustomerPrincipal implements UserDetails {

    private final Customer customer;

    public CustomerPrincipal(Customer customer) {
        this.customer = customer;
    }

    public UUID getId() {
        return customer.getId();
    }

    public String getEmail() {
        return customer.getEmail();
    }

    public boolean isEmailVerified() {
        return customer.isEmailVerified();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
    }

    @Override
    public String getPassword() { return customer.getPassword(); }

    @Override
    public String getUsername() { return customer.getEmail(); }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}