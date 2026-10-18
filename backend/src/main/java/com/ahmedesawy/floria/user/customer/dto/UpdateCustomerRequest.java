package com.ahmedesawy.floria.user.customer.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCustomerRequest {

    @Size(min = 2, message = "Username must be at least 2 characters")
    private String userName;

    @Email(message = "Invalid email")
    private String email;

    private MultipartFile image;
}