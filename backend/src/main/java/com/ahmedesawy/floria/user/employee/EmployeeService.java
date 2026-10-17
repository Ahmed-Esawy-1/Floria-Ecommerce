package com.ahmedesawy.floria.user.employee;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ahmedesawy.floria.auth.AuthorizationHelper;
import com.ahmedesawy.floria.auth.EmployeePrincipal;
import com.ahmedesawy.floria.common.exception.ForbiddenException;
import com.ahmedesawy.floria.common.exception.NotFoundException;
import com.ahmedesawy.floria.common.exception.ResourceAlreadyExistsException;
import com.ahmedesawy.floria.common.storage.FileStorageService;
import com.ahmedesawy.floria.role.Role;
import com.ahmedesawy.floria.role.RoleRepository;
import com.ahmedesawy.floria.user.TrashUserResponse;
import com.ahmedesawy.floria.user.customer.CustomerRepository;
import com.ahmedesawy.floria.user.employee.dto.request.CreateUserRequest;
import com.ahmedesawy.floria.user.employee.dto.request.UpdateEmployeeRequest;
import com.ahmedesawy.floria.user.employee.dto.response.EmployeeResponse;
import com.ahmedesawy.floria.user.employee.dto.response.UpdateEmployeeResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;
    private final AuthorizationHelper authHelper;
    private final PasswordEncoder encoder;
    private final FileStorageService fileStorageService;

    // ---- QUERIES -------------------------------------------------------
    @Transactional(readOnly = true)
    public Page<EmployeeResponse> getActiveEmployees(Pageable pageable) {
        return employeeRepository.findByDeletedAtIsNull(pageable)
                .map(EmployeeMapper::toEmployeeResponse);
    }

    @Transactional(readOnly = true)
    public List<TrashUserResponse> getTrashEmployees() {
        return employeeRepository.findByDeletedAtIsNotNull()
                .stream()
                .map(EmployeeMapper::toTrashResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UpdateEmployeeResponse getEmployeeById(UUID id) {
        return EmployeeMapper.toUpdateEmployeeResponse(employeeRepository.findByIdOrThrow(id, "Employee"));
    }

    // ---- CREATE (in dashboard) -----------------------------------------
    @Transactional
    public String createEmployee(CreateUserRequest req, EmployeePrincipal caller) {
        String userName = req.getUserName().trim();
        String email = req.getEmail().trim();
        String password = req.getPassword().trim();

        if (employeeRepository.existsByEmail(email) || customerRepository.existsByEmail(email))
            throw new ResourceAlreadyExistsException("Email already exists!");

        if (req.getRoleId() == null)
            throw new NotFoundException("Role not found");

        Role role = roleRepository.findByIdOrThrow(req.getRoleId(), "Role");

        // ---- Check if can create this role
        authHelper.assertCanAssignRole(role, caller);

        Employee employee = Employee.builder()
                .userName(userName)
                .email(email)
                .password(encoder.encode(password))
                .role(role)
                .emailVerified(true)
                .build();

        if (req.getImage() != null && !req.getImage().isEmpty())
            employee.setImageUrl(fileStorageService.uploadImage(req.getImage(), "users"));

        employeeRepository.save(employee);

        return "Employee created successfully.";
    }

    // ---- UPDATE (in dashboard) -----------------------------------------
    @Transactional
    public EmployeeResponse updateEmployee(UUID id, UpdateEmployeeRequest req, EmployeePrincipal caller) {
        Employee existing = employeeRepository.findByIdOrThrow(id, "Employee");
        // Check if Can update this employee
        authHelper.assertCanModifyEmployee(existing, caller);

        // Email
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            String newEmail = req.getEmail().trim();

            if (!newEmail.equalsIgnoreCase(existing.getEmail())) {
                if (employeeRepository.existsByEmailAndIdNot(newEmail, existing.getId())
                        || customerRepository.existsByEmail(newEmail))
                    throw new ResourceAlreadyExistsException("Email already exists!");

                existing.setEmail(newEmail);
            }
        }

        // Username
        if (req.getUserName() != null && !req.getUserName().isBlank()) {
            existing.setUserName(req.getUserName().trim());
        }

        // Password
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            existing.setPassword(encoder.encode(req.getPassword().trim()));
        }

        // Role
        if (req.getRoleId() != null
                && (existing.getRole() == null
                        || !req.getRoleId().equals(existing.getRole().getId()))) {

            // Nobody may change their own role (prevents self-escalation)
            // Can not change your role
            if (existing.getId().equals(caller.getId())) {
                throw new ForbiddenException("You cannot change your own role");
            }

            Role newRole = roleRepository.findByIdOrThrow(req.getRoleId(), "Role");
            authHelper.assertCanAssignRole(newRole, caller);
            existing.setRole(newRole);
        }

        // Image
        String oldImage = null;
        if (req.getImage() != null && !req.getImage().isEmpty()) {
            oldImage = existing.getImageUrl();
            existing.setImageUrl(fileStorageService.uploadImage(req.getImage(), "users"));
        }

        Employee saved = employeeRepository.save(existing);

        // Delete old image
        if (oldImage != null) {
            try {
                fileStorageService.deleteFile("users/" + oldImage);
            } catch (Exception e) {
                log.warn("Could not delete old image '{}' for employee {}", oldImage, id, e);
            }
        }

        return EmployeeMapper.toEmployeeResponse(saved);
    }

    // ---- SINGLE OPERATIONS ---------------------------------------------
    @Transactional
    public void restore(UUID id, EmployeePrincipal caller) {
        Employee user = employeeRepository.findByIdOrThrow(id, "Employee");
        authHelper.assertCanModifyEmployee(user, caller);
        user.setDeletedAt(null);
        employeeRepository.save(user);
    }

    @Transactional
    public void softDelete(UUID id, EmployeePrincipal caller) {
        Employee user = employeeRepository.findByIdOrThrow(id, "Employee");
        authHelper.assertCanDeleteEmployee(user, caller);
        user.setDeletedAt(LocalDateTime.now());
        employeeRepository.save(user);
    }

    @Transactional
    public void hardDelete(UUID id, EmployeePrincipal caller) {
        Employee user = employeeRepository.findByIdOrThrow(id, "Employee");
        authHelper.assertCanDeleteEmployee(user, caller);
        employeeRepository.delete(user);
    }

    // ---- BULK OPERATIONS -----------------------------------------------
    @Transactional
    public void restoreBulk(List<UUID> ids, EmployeePrincipal caller) {
        List<Employee> targets = loadAndAuthorize(ids, caller, false);
        employeeRepository.restoreBulk(targets.stream().map(Employee::getId).toList());
    }

    @Transactional
    public void softDeleteBulk(List<UUID> ids, EmployeePrincipal caller) {
        List<Employee> targets = loadAndAuthorize(ids, caller, true);
        employeeRepository.softDeleteBulk(
                targets.stream().map(Employee::getId).toList(), LocalDateTime.now());
    }

    @Transactional
    public void hardDeleteBulk(List<UUID> ids, EmployeePrincipal caller) {
        List<Employee> targets = loadAndAuthorize(ids, caller, true);
        employeeRepository.deleteAll(targets);
    }

    // ---- HELPERS -------------------------------------------------------
    private List<Employee> loadAndAuthorize(List<UUID> ids, EmployeePrincipal caller, boolean isDelete) {
        if (ids == null || ids.isEmpty())
            throw new NotFoundException("No employees found");

        List<Employee> targets = employeeRepository.findAllById(ids);
        if (targets.isEmpty())
            throw new NotFoundException("No employees found");

        // ---- Check id can update or delete employees
        for (Employee target : targets) {
            if (isDelete)
                authHelper.assertCanDeleteEmployee(target, caller);
            else
                authHelper.assertCanModifyEmployee(target, caller);
        }
        return targets;
    }
}