package com.fitbuddy.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a requested resource (e.g., user profile, workout, meal)
 * is not found in the system.
 * Automatically maps to HTTP 404 Not Found.
 */
public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(HttpStatus.NOT_FOUND, String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue));
    }

    public ResourceNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}
