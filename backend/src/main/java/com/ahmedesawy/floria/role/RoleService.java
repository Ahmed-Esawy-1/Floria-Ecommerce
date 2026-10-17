package com.ahmedesawy.floria.role;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.auth.AuthorizationHelper;
import com.ahmedesawy.floria.auth.EmployeePrincipal;
import com.ahmedesawy.floria.common.exception.ForbiddenException;
import com.ahmedesawy.floria.common.exception.NotFoundException;
import com.ahmedesawy.floria.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.floria.role.dto.RoleRequest;
import com.ahmedesawy.floria.role.dto.RoleResponse;
import com.ahmedesawy.floria.user.employee.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;
    private final EmployeeRepository employeeRepository;
    private final AuthorizationHelper authHelper;

    // ---- ALL ROLES
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(RoleMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RoleResponse> getAssignableRoles(EmployeePrincipal caller) {
        return roleRepository.findAll().stream()
                .filter(r -> authHelper.canAssignRole(r, caller))
                .map(RoleMapper::toResponse)
                .toList();
    }

    // ---- ROLES THE CURRENT USER CAN ASSIGN
    @Transactional(readOnly = true)
    public List<RoleResponse> getAssignableRoles(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof EmployeePrincipal caller))
            return List.of();

        return roleRepository.findAll().stream()
                .filter(r -> authHelper.canAssignRole(r, caller))
                .map(RoleMapper::toResponse)
                .toList();
    }

    // ---- CREATE
    @Transactional
    public String createRole(RoleRequest req) {
        String code = req.getCode().trim();
        String nameEn = req.getNameEn().trim();
        String nameAr = req.getNameAr().trim();

        if (Role.OWNER_CODE.equals(code)) {
            throw new ForbiddenException("The OWNER role cannot be created manually");
        }
        if (roleRepository.existsByCode(code)) {
            throw new ResourceAlreadyExistsException("Role code already exists!");
        }
        if (roleRepository.existsByNameEn(nameEn)) {
            throw new ResourceAlreadyExistsException("English name already exists!");
        }
        if (roleRepository.existsByNameAr(nameAr)) {
            throw new ResourceAlreadyExistsException("Arabic name already exists!");
        }

        Role role = Role.builder()
                .code(code)
                .nameEn(nameEn)
                .nameAr(nameAr)
                .descriptionEn(req.getDescriptionEn())
                .descriptionAr(req.getDescriptionAr())
                .permissions(req.getPermissions() == null
                        ? new HashSet<>()
                        : new HashSet<>(req.getPermissions()))
                .build();

        roleRepository.save(role);
        return "Success";
    }

    // ---- DELETE
    @Transactional
    public void deleteRole(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Role not found"));

        if (Role.OWNER_CODE.equals(role.getCode())) {
            throw new ForbiddenException("The OWNER role cannot be modified or deleted");
        }
        if (employeeRepository.existsByRoleId(id)) {
            throw new ForbiddenException("Role is assigned to employees and cannot be deleted");
        }
        roleRepository.delete(role);
    }
}