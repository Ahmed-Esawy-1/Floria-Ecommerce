package com.ahmedesawy.floria.common.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.NullSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ahmedesawy.floria.auth.oauth.OAuth2AuthenticationSuccessHandler;
import com.ahmedesawy.floria.common.filter.JwtFilter;
import com.ahmedesawy.floria.role.Permission;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtFilter jwtFilter;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ---- FILTER CHAIN ----------------------------------------------------
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .securityContext(sc -> sc.securityContextRepository(new NullSecurityContextRepository()))
                .authorizeHttpRequests(auth -> auth
                        // AUTHENTICATED AUTH
                        .requestMatchers("/auth/me").authenticated()
                        // PUBLIC AUTH
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                        .requestMatchers("/login/oauth2/**").permitAll()
                        .requestMatchers("/account/**").authenticated()
                        .requestMatchers("/error").permitAll()
                        // PUPLIC SHOP
                        .requestMatchers("/shop/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/occasions/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/colors/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/cities/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/sections/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/section/*/products").permitAll()
                        .requestMatchers("/chat/**").permitAll()
                        .requestMatchers("/upload_images/**").permitAll()
                        // AUTHENTICATED SHOP
                        .requestMatchers("/shop/order/**", "/shop/orders/**").authenticated()
                        .requestMatchers("/users/updateProfile").authenticated()
                        .requestMatchers(HttpMethod.GET, "/product/*/comments").permitAll()
                        .requestMatchers(HttpMethod.POST, "/product/*/comment/add").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/product/*/comment/edit/*").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/product/*/comment/delete/*").authenticated()
                        // OPTIONS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // AUTHENTICATED ADMIN — dashboard roles only
                        .requestMatchers("/dashboard/**").hasAuthority(Permission.VIEW_DASHBOARD.getPermission())
                        .anyRequest().authenticated())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(
                                oAuth2AuthenticationSuccessHandler)
                        .failureHandler((req, res, ex) -> {
                            res.sendRedirect(frontendBaseUrl + "/login?error=oauth_failed");
                        }))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

        ;
        return http.build();
    }

    // ---- CORS
    // ---------------------------------------------------------------------
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173", // dashboard
                "http://localhost:3000" // shop
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("X-XSRF-TOKEN"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}