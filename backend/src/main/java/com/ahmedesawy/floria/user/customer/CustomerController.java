// src/main/java/com/ahmedesawy/floria/user/customer/CustomerController.java
package com.ahmedesawy.floria.user.customer;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.user.customer.dto.CustomerResponse;
import com.ahmedesawy.floria.user.customer.dto.UpdateCustomerRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // ---- QUERIES -------------------------------------------------------
    @PreAuthorize("hasAuthority('read:customer')")
    @GetMapping("/customers")
    public Page<CustomerResponse> getCustomers(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "userName", direction = Sort.Direction.ASC) Pageable pageable) {
        return customerService.getCustomers(search, pageable);
    }

    @PreAuthorize("hasAuthority('read:customer')")
    @GetMapping("/customer/{id}")
    public CustomerResponse getCustomerById(@PathVariable UUID id) {
        return customerService.getCustomerById(id);
    }

    // ---- UPDATE --------------------------------------------------------
    @PreAuthorize("hasAuthority('update:customer')")
    @PutMapping(value = "/customer/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CustomerResponse updateCustomer(
            @PathVariable UUID id,
            @Valid @ModelAttribute UpdateCustomerRequest request) {
        return customerService.updateCustomer(id, request);
    }
}