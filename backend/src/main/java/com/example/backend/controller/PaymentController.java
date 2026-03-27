package com.example.backend.controller;

import com.example.backend.dto.PaymentRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.backend.service.PaymentService;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Map<String, String>> create(@Valid @RequestBody PaymentRequest request) {
        log.info("POST /api/payment geraakt met request: {}", request);
        paymentService.registerTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Ticket succesvol opgeslagen"));
    }
}