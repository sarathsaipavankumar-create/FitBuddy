package com.fitbuddy.dto;

import java.time.LocalDateTime;

/**
 * HealthResponse DTO
 *
 * Encapsulates the health-check diagnostics returned by /api/health.
 * Contains server status, application name, version, and server timestamp.
 */
public class HealthResponse {

    private String status;
    private String application;
    private String version;
    private String environment;
    private LocalDateTime timestamp;

    public HealthResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public HealthResponse(String status, String application, String version, String environment) {
        this.status = status;
        this.application = application;
        this.version = version;
        this.environment = environment;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
