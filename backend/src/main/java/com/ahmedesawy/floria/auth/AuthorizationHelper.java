package com.ahmedesawy.floria.auth;

import java.util.Set;

import org.springframework.stereotype.Component;

import com.ahmedesawy.floria.common.exception.ForbiddenException;
import com.ahmedesawy.floria.role.Permission;
import com.ahmedesawy.floria.role.Role;
import com.ahmedesawy.floria.user.employee.Employee;

@Component
public class AuthorizationHelper {

    // ---- filter the assignable-roles (Role Service) -----------------------------
    public boolean canAssignRole(Role targetRole, EmployeePrincipal caller) {
        if (caller.isOwner())
            return true;
        if (Role.OWNER_CODE.equals(targetRole.getCode()))
            return false;
        if (isSameRole(targetRole, caller))
            return false;
        return caller.getPermissions().containsAll(permissionsOf(targetRole));
    }

    // ---- CREATE --------------------------------------
    public void assertCanAssignRole(Role newRole, EmployeePrincipal caller) {
        if (caller.isOwner()) {
            // Only one OWNER should exist
            if (Role.OWNER_CODE.equals(newRole.getCode())) {
                throw new ForbiddenException("You cannot assign the OWNER role");
            }
            return;
        }

        if (Role.OWNER_CODE.equals(newRole.getCode())) {
            throw new ForbiddenException("You cannot assign the OWNER role");
        }

        if (isSameRole(newRole, caller)) {
            throw new ForbiddenException("You cannot assign a role equal to yours");
        }

        if (!caller.getPermissions().containsAll(permissionsOf(newRole))) {
            throw new ForbiddenException("You cannot assign a role with higher privileges than yours");
        }
    }

    // ----- UPDATE -------------------------------
    public void assertCanModifyEmployee(Employee target, EmployeePrincipal caller) {
        if (caller.isOwner() || target.getId().equals(caller.getId()))
            return;

        Role targetRole = target.getRole();
        if (targetRole == null)
            return;

        if (Role.OWNER_CODE.equals(targetRole.getCode())) {
            throw new ForbiddenException("You cannot modify an OWNER account");
        }

        if (isSameRole(targetRole, caller)) {
            throw new ForbiddenException("You cannot modify an account with the same role as yours");
        }

        if (!caller.getPermissions().containsAll(permissionsOf(targetRole))) {
            throw new ForbiddenException("You cannot modify an account with higher privileges than yours");
        }
    }

    // ---- DELETE -------------------
    public void assertCanDeleteEmployee(Employee target, EmployeePrincipal caller) {
        if (target.getId().equals(caller.getId())) {
            throw new ForbiddenException("You cannot delete your own account");
        }
        assertCanModifyEmployee(target, caller);
    }

    // ---- HELPERS ------------------------
    private boolean isSameRole(Role role, EmployeePrincipal caller) {
        return role != null && role.getCode() != null
                && role.getCode().equals(caller.getRoleName());
    }

    private Set<Permission> permissionsOf(Role role) {
        return role.getPermissions() == null ? Set.of() : role.getPermissions();
    }
}