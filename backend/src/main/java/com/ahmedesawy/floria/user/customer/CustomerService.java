package com.ahmedesawy.floria.user.customer;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.floria.common.storage.FileStorageService;
import com.ahmedesawy.floria.user.customer.dto.CustomerResponse;
import com.ahmedesawy.floria.user.customer.dto.UpdateCustomerRequest;
import com.ahmedesawy.floria.user.employee.EmployeeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final FileStorageService fileStorageService;

    // ---- QUERIES -------------------------------------------------------
    @Transactional(readOnly = true)
    public Page<CustomerResponse> getCustomers(String search, Pageable pageable) {
        String q = search == null ? "" : search.trim();

        Page<Customer> page = q.isEmpty()
                ? customerRepository.findAll(pageable)
                : customerRepository.searchByNameOrEmail(q, pageable);

        return page.map(CustomerMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(UUID id) {
        return CustomerMapper.toResponse(customerRepository.findByIdOrThrow(id, "Customer"));
    }

    // ---- UPDATE --------------------------------------------------------
    @Transactional
    public CustomerResponse updateCustomer(UUID id, UpdateCustomerRequest req) {
        Customer existing = customerRepository.findByIdOrThrow(id, "Customer");

        // Email: must be unique across customers and employees
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            String newEmail = req.getEmail().trim();

            if (!newEmail.equalsIgnoreCase(existing.getEmail())) {
                if (customerRepository.existsByEmailAndIdNot(newEmail, id)
                        || employeeRepository.existsByEmail(newEmail))
                    throw new ResourceAlreadyExistsException("Email already exists!");

                existing.setEmail(newEmail);
            }
        }

        // Username
        if (req.getUserName() != null && !req.getUserName().isBlank()) {
            existing.setUserName(req.getUserName().trim());
        }

        // Image
        String oldImage = null;
        if (req.getImage() != null && !req.getImage().isEmpty()) {
            oldImage = existing.getImageUrl();
            existing.setImageUrl(fileStorageService.uploadImage(req.getImage(), "users"));
        }

        Customer saved = customerRepository.save(existing);

        // Delete the old image only after the new one is saved
        if (oldImage != null) {
            try {
                fileStorageService.deleteFile("users/" + oldImage);
            } catch (Exception e) {
                log.warn("Could not delete old image '{}' for customer {}", oldImage, id, e);
            }
        }

        return CustomerMapper.toResponse(saved);
    }
}