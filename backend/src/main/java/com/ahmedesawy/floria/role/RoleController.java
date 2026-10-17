package com.ahmedesawy.floria.role;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.floria.auth.EmployeePrincipal;
import com.ahmedesawy.floria.role.dto.RoleRequest;
import com.ahmedesawy.floria.role.dto.RoleResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@Validated
public class RoleController {
    private final RoleService roleService;

    // ---- QUIRES --------------------------------------------
    @PreAuthorize("hasAuthority('read:role')")
    @GetMapping("/roles")
    public List<RoleResponse> getAllRoles() {
        return roleService.getAllRoles();
    }

    @PreAuthorize("hasAnyAuthority('create:employee', 'update:employee')")
    @GetMapping("/roles/assignable")
    public List<RoleResponse> getAssignableRoles(@AuthenticationPrincipal EmployeePrincipal principal) {
        return roleService.getAssignableRoles(principal);
    }

    // ---- CREATE --------------------------------------------
    @PreAuthorize("hasAuthority('create:role')")
    @PostMapping("/role/create")
    public ResponseEntity<String> createRole(@Valid @RequestBody RoleRequest req) {
        return new ResponseEntity<>(roleService.createRole(req), HttpStatus.CREATED);
    }

}
