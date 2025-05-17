package com.alexaras.finance_tracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(registry ->
                        registry
                                .requestMatchers("/h2-console/**").permitAll() // Allow H2 console access
                                .requestMatchers("/swagger-ui/**").permitAll() // Allow Swagger UI access
                                .requestMatchers("/v3/api-docs/**").permitAll() // Allow OpenAPI docs access
                                .anyRequest().authenticated() // Require authentication for all other requests
                )
                .csrf(csrf -> csrf.disable()) // Disable CSRF for development/testing
                .headers(headers -> headers.frameOptions(frame -> frame.disable())); // Allow H2 console iframes
        return http.build();
    }
}
