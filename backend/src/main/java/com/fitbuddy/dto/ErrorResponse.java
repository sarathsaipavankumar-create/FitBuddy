package com.fitbuddy.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Standard Error Response DTO
 *
 * Returned whenever a request fails or triggers an exception.
 * Guarantees a consistent JSON structure for the frontend error handling.
 *
 * Example JSON:
 * {
 *   "success": false,
 *   "message": "Validation failed",
 *   "status": 400,
 *   "errors": ["Email must be a valid email address", "Password must be at least 6 characters"],
 *   "timestamp": "2026-10-23T10:00:00"
 * }
 */
public class ErrorResponse {

    private boolean success;
    private String message;
    private int status;
    private List<String> errors;
    private LocalDateTime timestamp;

    public ErrorResponse() {
        this.success = false;
        this.errors = new ArrayList<>();
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(int status, String message) {
        this.success = false;
        this.status = status;
        this.message = message;
        this.errors = new ArrayList<>();
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(int status, String message, List<String> errors) {
        this.success = false;
        this.status = status;
        this.message = message;
        this.errors = errors != null ? errors : new ArrayList<>();
        this.timestamp = LocalDateTime.now();
    }

    public void addError(String error) {
        if (this.errors == null) {
            this.errors = new ArrayList<>();
        }
        this.errors.add(error);
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
