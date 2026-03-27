package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PaymentRequest(

        @NotBlank(message = "Naam is verplicht")
        String name,

        @NotBlank(message = "E-mailadres is verplicht")
        @Email(message = "E-mailadres is ongeldig")
        String email,

        @NotBlank(message = "Telefoon is verplicht")
        String phone,

        @NotNull(message = "Datum voorstelling is verplicht")
        @FutureOrPresent(message = "Datum voorstelling moet vandaag of later zijn")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate showDate,

        @NotNull(message = "Aantal kaarten is verplicht")
        @Min(value = 1, message = "Aantal kaarten moet minimaal 1 zijn")
        @Max(value = 20, message = "Aantal kaarten mag maximaal 20 zijn")
        Integer ticketCount
) {}