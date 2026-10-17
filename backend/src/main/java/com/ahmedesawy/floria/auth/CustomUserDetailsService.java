package com.ahmedesawy.floria.auth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ahmedesawy.floria.user.customer.CustomerRepository;
import com.ahmedesawy.floria.user.employee.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return employeeRepository.findByEmail(email)
                .<UserDetails>map(EmployeePrincipal::new) 

                .or(() -> customerRepository.findByEmail(email)
                        .map(CustomerPrincipal::new))

                .orElseThrow(() -> new UsernameNotFoundException("Account not found"));
    }

}
