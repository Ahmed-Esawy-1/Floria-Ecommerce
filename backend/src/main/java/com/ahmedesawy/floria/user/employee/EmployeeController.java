package com.ahmedesawy.floria.user.employee;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.auth.EmployeePrincipal;
import com.ahmedesawy.floria.user.TrashUserResponse;
import com.ahmedesawy.floria.user.employee.dto.request.CreateUserRequest;
import com.ahmedesawy.floria.user.employee.dto.request.UpdateEmployeeRequest;
import com.ahmedesawy.floria.user.employee.dto.response.EmployeeResponse;
import com.ahmedesawy.floria.user.employee.dto.response.UpdateEmployeeResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // ---- QUERIES -------------------------------------------------------
    @PreAuthorize("hasAuthority('read:employee')")
    @GetMapping("/employees")
    public Page<EmployeeResponse> getActiveEmployees(
            @PageableDefault(size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return employeeService.getActiveEmployees(pageable);
    }

    @PreAuthorize("hasAuthority('read:employee')")
    @GetMapping("/employees/trash")
    public List<TrashUserResponse> getTrashEmployees() {
        return employeeService.getTrashEmployees();
    }

    @PreAuthorize("hasAuthority('read:employee')")
    @GetMapping("/employee/{id}")
    public UpdateEmployeeResponse getEmployeeById(@PathVariable UUID id) {
        return employeeService.getEmployeeById(id);
    }

    // ---- CREATE --------------------------------------------------------
    @PreAuthorize("hasAuthority('create:employee')")
    @PostMapping(value = "/employee/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createEmployee(
            @Valid @ModelAttribute CreateUserRequest request,
            @AuthenticationPrincipal EmployeePrincipal principal) {
        return new ResponseEntity<>(employeeService.createEmployee(request, principal), HttpStatus.CREATED);
    }

    // ---- UPDATE --------------------------------------------------------
    @PreAuthorize("hasAuthority('update:employee')")
    @PutMapping(value = "/employee/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public EmployeeResponse updateEmployee(
            @PathVariable UUID id,
            @Valid @ModelAttribute UpdateEmployeeRequest request,
            @AuthenticationPrincipal EmployeePrincipal principal) {
        return employeeService.updateEmployee(id, request, principal);
    }

    // ---- SINGLE OPERATIONS ---------------------------------------------
    @PreAuthorize("hasAuthority('delete:employee')")
    @PatchMapping("/employee/restore/{id}")
    public ResponseEntity<Void> restoreUser(
            @PathVariable UUID id,
            @AuthenticationPrincipal EmployeePrincipal principal) {
        employeeService.restore(id, principal);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:employee')")
    @DeleteMapping("/employee/delete/{id}")
    public ResponseEntity<Void> softDelete(
            @PathVariable UUID id,
            @AuthenticationPrincipal EmployeePrincipal principal) {
        employeeService.softDelete(id, principal);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:employee')")
    @DeleteMapping("/employee/delete/{id}/permanent")
    public ResponseEntity<Void> hardDelete(
            @PathVariable UUID id,
            @AuthenticationPrincipal EmployeePrincipal principal) {
        employeeService.hardDelete(id, principal);
        return ResponseEntity.noContent().build();
    }

    // ---- BULK OPERATIONS -----------------------------------------------
    @PreAuthorize("hasAuthority('delete:employee')")
    @PatchMapping("/employees/restore/bulk")
    public ResponseEntity<Void> restoreBulk(
            @RequestBody List<UUID> ids,
            @AuthenticationPrincipal EmployeePrincipal principal) {
        employeeService.restoreBulk(ids, principal);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:employee')")
    @DeleteMapping("/employees/delete/bulk")
    public ResponseEntity<Void> softDeleteBulk(
            @RequestBody List<UUID> ids,
            @AuthenticationPrincipal EmployeePrincipal principal) {
        employeeService.softDeleteBulk(ids, principal);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('delete:employee')")
    @DeleteMapping("/employees/delete/permanent/bulk")
    public ResponseEntity<Void> hardDeleteBulk(
            @RequestBody List<UUID> ids,
            @AuthenticationPrincipal EmployeePrincipal principal) {
        employeeService.hardDeleteBulk(ids, principal);
        return ResponseEntity.noContent().build();
    }
}