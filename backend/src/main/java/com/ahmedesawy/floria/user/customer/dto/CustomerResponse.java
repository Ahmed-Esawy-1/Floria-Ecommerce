package com.ahmedesawy.floria.user.customer.dto;

import com.ahmedesawy.floria.user.AuthProvider;
import com.ahmedesawy.floria.user.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CustomerResponse extends UserResponse {
    private AuthProvider provider;
}
