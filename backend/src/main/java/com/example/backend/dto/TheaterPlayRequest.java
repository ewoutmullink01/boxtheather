package com.example.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class TheaterPlayRequest {

    @NotBlank(message = "Titel is verplicht")
    private String title;

    @NotBlank(message = "Beschrijving is verplicht")
    private String description;

    @NotNull(message = "Actieve status is verplicht")
    private Boolean isActive;

    @NotBlank(message = "Locatie is verplicht")
    private String location;

    @NotBlank(message = "Duur is verplicht")
    private String duration;

    @NotNull(message = "Prijs is verplicht")
    @DecimalMin(value = "0.0", inclusive = true, message = "Prijs moet 0 of hoger zijn")
    private BigDecimal priceEur;

    private String imageUrl;

    @NotEmpty(message = "Minimaal één voorstelling is verplicht")
    @Valid
    private List<PerformanceRequest> performances;

    @Getter
    @Setter
    public static class PerformanceRequest {
        @NotBlank(message = "Datum is verplicht")
        private String date;

        @NotBlank(message = "Tijd is verplicht")
        private String time;

        @NotNull(message = "Beschikbare tickets zijn verplicht")
        @Min(value = 0, message = "Beschikbare tickets moeten 0 of hoger zijn")
        private Integer availableTickets;
    }
}
