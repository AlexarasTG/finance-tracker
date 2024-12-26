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
                .authorizeHttpRequests()
                .requestMatchers("/h2-console/**").permitAll() // Allow access to H2 console
                .anyRequest().authenticated() // Protect all other endpoints
                .and()
                .csrf().disable() // Disable CSRF for H2 console
                .headers().frameOptions().disable(); // Enable iframes for H2 console
        return http.build();
    }
}
