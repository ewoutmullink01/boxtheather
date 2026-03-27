package com.example.backend.service;

import com.example.backend.dto.PaymentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final GoogleSheetsGateway googleSheetsGateway;

    public void registerTicket(PaymentRequest request) {
        googleSheetsGateway.appendTicket(request);
    }
}