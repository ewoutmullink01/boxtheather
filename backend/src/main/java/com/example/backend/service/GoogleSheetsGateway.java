package com.example.backend.service;


import com.example.backend.config.GoogleScriptProperties;
import com.example.backend.dto.PaymentRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor

public class GoogleSheetsGateway {

    private final RestClient restClient;
    private final GoogleScriptProperties properties;

    public void appendTicket(PaymentRequest request) {
        Map<String, Object> payload = Map.of(
                "secret", properties.secret(),
                "name", request.name(),
                "email", request.email(),
                "phone", request.phone(),
                "showDate", request.showDate().toString(),
                "ticketCount", request.ticketCount()
        );

        log.info("Posting naar Apps Script URL: {}", properties.url());
        log.debug("Payload naar Apps Script: {}", payload);


        String response = restClient.post()
                .uri(properties.url())
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(String.class);

        log.info("Response van Apps Script: {}", response);

    }
}
