package com.alexaras.finance_tracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults; // Import for withDefaults

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(registry ->
                        registry
                                .requestMatchers(
                                        "/", // Allow access to the root path
                                        "/index.html", // Allow access to index.html
                                        "/assets/**", // Common pattern for Vite/React build assets (JS, CSS)
                                        "/*.js",
                                        "/*.css",
                                        "/*.ico",
                                        "/*.png",
                                        "/*.svg",
                                        "/h2-console/**",
                                        "/swagger-ui/**",
                                        "/v3/api-docs/**",
                                        "/api/**"
                                ).permitAll()
                                .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/h2-console/**", "/api/**") // Keep CSRF disabled for H2 and API for now
                )
                .headers(headers -> headers.frameOptions(frame -> frame.disable())); // Allow H2 console iframes
        return http.build();
    }
}
