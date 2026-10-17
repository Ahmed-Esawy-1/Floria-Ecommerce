package com.ahmedesawy.floria.order.dto.request;

import java.util.List;

import com.ahmedesawy.floria.order.Payment;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name is too long")
    private String fullName;

    @NotNull(message = "Payment Method is required") // ← Changed from @NotBlank
    private Payment paymentMethod;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^01[0125]\\d{8}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Your address is required")
    private String address;

    @NotNull(message = "City is required")
    private Integer cityId;

    private String couponCode;

    private String hint;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;
}