package com.example.backend.service;

import com.example.backend.dto.TheaterPlayRequest;
import com.example.backend.dto.TheaterPlayResponse;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.model.PerformanceEntity;
import com.example.backend.model.TheaterPlayEntity;
import com.example.backend.repository.TheaterPlayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TheaterPlayService {

    private final TheaterPlayRepository theaterPlayRepository;

    @Transactional
    public TheaterPlayResponse create(TheaterPlayRequest request) {
        TheaterPlayEntity entity = new TheaterPlayEntity();
        applyRequest(entity, request);
        TheaterPlayEntity saved = theaterPlayRepository.save(entity);
        return toResponse(saved);
    }

    @Transactional
    public TheaterPlayResponse update(Long playId, TheaterPlayRequest request) {
        TheaterPlayEntity entity = findById(playId);
        applyRequest(entity, request);
        TheaterPlayEntity saved = theaterPlayRepository.save(entity);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long playId) {
        TheaterPlayEntity entity = findById(playId);
        theaterPlayRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    public List<TheaterPlayResponse> list() {
        return theaterPlayRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TheaterPlayResponse getActive() {
        TheaterPlayEntity entity = theaterPlayRepository.findFirstByActiveTrueOrderByUpdatedAtDesc()
                .orElseThrow(() -> new ResourceNotFoundException("Geen actieve toneelvoorstelling gevonden"));
        return toResponse(entity);
    }

    private TheaterPlayEntity findById(Long playId) {
        return theaterPlayRepository.findById(playId)
                .orElseThrow(() -> new ResourceNotFoundException("Toneelvoorstelling niet gevonden met id " + playId));
    }

    private void applyRequest(TheaterPlayEntity entity, TheaterPlayRequest request) {
        if (request.getIsActive()) {
            deactivateAllOtherPlays(entity.getId());
        }

        entity.setTitle(request.getTitle().trim());
        entity.setDescription(request.getDescription().trim());
        entity.setActive(request.getIsActive());
        entity.setLocation(request.getLocation().trim());
        entity.setDuration(request.getDuration().trim());
        entity.setPriceEur(request.getPriceEur());
        entity.setImageUrl(request.getImageUrl() == null || request.getImageUrl().isBlank() ? null : request.getImageUrl().trim());

        entity.getPerformances().clear();
        for (TheaterPlayRequest.PerformanceRequest performanceRequest : request.getPerformances()) {
            PerformanceEntity performance = new PerformanceEntity();
            performance.setDate(performanceRequest.getDate().trim());
            performance.setTime(performanceRequest.getTime().trim());
            performance.setAvailableTickets(performanceRequest.getAvailableTickets());
            performance.setTheaterPlay(entity);
            entity.getPerformances().add(performance);
        }
    }

    private void deactivateAllOtherPlays(Long currentPlayId) {
        List<TheaterPlayEntity> plays = theaterPlayRepository.findAll();
        for (TheaterPlayEntity play : plays) {
            if (currentPlayId == null || !play.getId().equals(currentPlayId)) {
                play.setActive(false);
            }
        }
    }

    private TheaterPlayResponse toResponse(TheaterPlayEntity entity) {
        return TheaterPlayResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .isActive(entity.isActive())
                .location(entity.getLocation())
                .duration(entity.getDuration())
                .priceEur(entity.getPriceEur())
                .imageUrl(entity.getImageUrl())
                .performances(entity.getPerformances().stream()
                        .map(performance -> TheaterPlayResponse.PerformanceResponse.builder()
                                .id(performance.getId())
                                .date(performance.getDate())
                                .time(performance.getTime())
                                .availableTickets(performance.getAvailableTickets())
                                .build())
                        .toList())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
