package com.fitbuddy.controller;

import com.fitbuddy.dto.ApiResponse;
import com.fitbuddy.dto.HealthResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Health Check Controller
 *
 * Exposes a public diagnostic endpoint at GET /api/health to verify that the
 * Spring Boot backend application is running, healthy, and accepting requests.
 *
 * Annotations explained simply:
 * - @RestController: Marks this class as a Spring controller where methods return JSON responses.
 * - @RequestMapping: Defines the base URL path for all endpoints in this controller.
 * - @GetMapping: Maps HTTP GET requests to the healthCheck() method.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Value("${app.name:FitBuddy Backend API}")
    private String appName;

    @Value("${app.version:1.0.0}")
    private String appVersion;

    /**
     * Diagnostic Health Check Endpoint
     *
     * URL: GET /api/health
     * Returns: Standardized ApiResponse containing HealthResponse diagnostic info.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<HealthResponse>> healthCheck() {
        HealthResponse healthData = new HealthResponse(
                "UP",
                appName,
                appVersion,
                "development"
        );

        ApiResponse<HealthResponse> response = ApiResponse.success(
                "FitBuddy backend service is healthy and operational",
                healthData
        );

        return ResponseEntity.ok(response);
    }
}
