package com.example.backend.controller;

import com.example.backend.dto.TheaterPlayRequest;
import com.example.backend.dto.TheaterPlayResponse;
import com.example.backend.service.TheaterPlayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theater-plays")
@RequiredArgsConstructor
public class TheaterPlayController {

    private final TheaterPlayService theaterPlayService;

    @GetMapping
    public List<TheaterPlayResponse> list() {
        return theaterPlayService.list();
    }

    @GetMapping("/active")
    public TheaterPlayResponse getActive() {
        return theaterPlayService.getActive();
    }

    @PostMapping
    public ResponseEntity<TheaterPlayResponse> create(@Valid @RequestBody TheaterPlayRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(theaterPlayService.create(request));
    }

    @PutMapping("/{playId}")
    public TheaterPlayResponse update(@PathVariable Long playId, @Valid @RequestBody TheaterPlayRequest request) {
        return theaterPlayService.update(playId, request);
    }

    @DeleteMapping("/{playId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long playId) {
        theaterPlayService.delete(playId);
    }
}
