package com.ahmedesawy.floria.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactRequest {

    @NotBlank
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank
    @Email
    @Size(max = 150)
    private String email;

    @NotBlank
    @Pattern(regexp = "general|bespoke|events|corporate|press")
    private String subject;

    @NotBlank
    @Size(min = 10, max = 1000)
    private String message;
}