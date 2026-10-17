package com.ahmedesawy.floria.common.init;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.ahmedesawy.floria.role.Permission;
import com.ahmedesawy.floria.role.Role;
import com.ahmedesawy.floria.role.RoleRepository;
import com.ahmedesawy.floria.user.employee.Employee;
import com.ahmedesawy.floria.user.employee.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OwnerSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String OWNER_EMAIL = "ahmed76esawy@gmail.com";

    @Override
    public void run(String... args) throws Exception {

        Optional<Role> existingRole = roleRepository.findByCode("OWNER");

        Role ownerRole = existingRole
                .map(role -> {
                    role.setPermissions(new HashSet<>(Arrays.asList(Permission.values())));
                    return roleRepository.save(role);
                })
                .orElseGet(() -> roleRepository.save(Role.owner()));

        employeeRepository.findByEmail(OWNER_EMAIL).ifPresentOrElse(employee -> {
            if (!employee.getRole().getId().equals(ownerRole.getId())) {
                employee.setRole(ownerRole);
                employeeRepository.save(employee);
            }
        }, () -> {
            Employee owner = new Employee();
            owner.setUserName("Ahmed Esawy");
            owner.setEmail(OWNER_EMAIL);
            owner.setPassword(passwordEncoder.encode("ahmedesawy2"));
            owner.setRole(ownerRole);
            owner.setEmailVerified(true);
            employeeRepository.save(owner);
        });
    }

}
