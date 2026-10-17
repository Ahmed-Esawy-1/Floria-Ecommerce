package com.ahmedesawy.floria.auth;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component 
public class PrincipalResolver {
    
    public AccountIdentity resolve(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if(principal instanceof CustomerPrincipal customer) {
            return new AccountIdentity(customer.getId(), customer.getEmail(), AccountIdentity.AccountType.CUSTOMER);
        }

        if(principal instanceof EmployeePrincipal employee) {
            return new AccountIdentity(employee.getId(), employee.getEmail(), AccountIdentity.AccountType.EMPLOYEE);
        }

        throw new IllegalStateException("Unsupported principal type: " + principal.getClass());
    }
}
