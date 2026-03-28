package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Value
@Builder
public class TheaterPlayResponse {
    Long id;
    String title;
    String description;
    @JsonProperty("isActive")
    boolean isActive;
    String location;
    String duration;
    BigDecimal priceEur;
    String imageUrl;
    List<PerformanceResponse> performances;
    Instant createdAt;
    Instant updatedAt;

    @Value
    @Builder
    public static class PerformanceResponse {
        Long id;
        String date;
        String time;
        int availableTickets;
    }
}
