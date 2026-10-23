package com.fitbuddy.exception;

import org.springframework.http.HttpStatus;

/**
 * Base custom runtime exception for FitBuddy business logic errors.
 * Includes an associated HTTP status code.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
