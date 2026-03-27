package com.example.backend.exceptions;

public class GoogleSheetsException extends RuntimeException {
    public GoogleSheetsException(String message, Throwable cause) {
        super(message, cause);
    }
}