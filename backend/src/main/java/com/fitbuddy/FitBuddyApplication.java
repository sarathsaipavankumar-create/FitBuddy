package com.fitbuddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * FitBuddyApplication
 *
 * The main entry point for the FitBuddy Spring Boot backend.
 *
 * Features:
 * - Boots up the embedded Apache Tomcat web server on port 8080.
 * - Discovers and registers Spring components (Controllers, Services, Repositories).
 * - Initializes Spring Security, BCrypt password hashing, and CORS filtering.
 */
@SpringBootApplication
public class FitBuddyApplication {

    public static void main(String[] args) {
        SpringApplication.run(FitBuddyApplication.class, args);
    }
}
