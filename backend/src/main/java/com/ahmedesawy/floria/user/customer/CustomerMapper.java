package com.ahmedesawy.floria.user.customer;

import com.ahmedesawy.floria.common.util.ImageUrlResolver;
import com.ahmedesawy.floria.user.customer.dto.CustomerResponse;

public class CustomerMapper {

    // ---- MAIN EMPLOYEE Response
    public static CustomerResponse toResponse(Customer c) {
        return CustomerResponse.builder()
                .id(c.getId())
                .userName(c.getUserName())
                .email(c.getEmail())
                .imageUrl(ImageUrlResolver.resolve("users", c.getImageUrl()))
                .provider(c.getProvider())
                .build();
    }
}
