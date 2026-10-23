package com.fitbuddy.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when an invalid argument or illegal state is encountered.
 * Automatically maps to HTTP 400 Bad Request.
 */
public class BadRequestException extends ApiException {

    public BadRequestException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
