package com.fitbuddy.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Security Configuration
 *
 * Configures Spring Security for the FitBuddy application.
 *
 * Key Responsibilities:
 * 1. BCrypt Password Hashing: Provides a strong, industry-standard PasswordEncoder bean.
 * 2. CORS (Cross-Origin Resource Sharing): Permits the local frontend (http://localhost:8000)
 *    to communicate seamlessly with backend REST endpoints.
 * 3. Endpoint Authorization: Explicitly permits public endpoints (like /api/health)
 *    while requiring authentication for protected resources.
 *    (Security is NOT disabled globally).
 * 4. Stateless REST API: Configures stateless session management.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.frontend.origin:http://localhost:8000}")
    private String frontendOrigin;

    /**
     * BCryptPasswordEncoder provides strong, salted one-way hashing
     * to ensure plaintext passwords are never stored.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Security filter chain defining authentication rules and CORS handling.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Disabled for stateless REST API tokens
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow public access to health check diagnostics
                .requestMatchers("/api/health", "/api/health/**").permitAll()
                // Allow public access to exercises catalogue
                .requestMatchers("/api/exercises", "/api/exercises/**").permitAll()
                // Allow browser CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // All other API endpoints require authentication
                .anyRequest().authenticated()
            );

        return http.build();
    }

    /**
     * CORS Configuration bean allowing access from the FitBuddy frontend.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            frontendOrigin,
            "http://127.0.0.1:8000",
            "http://localhost:5500",
            "http://127.0.0.1:5500"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
