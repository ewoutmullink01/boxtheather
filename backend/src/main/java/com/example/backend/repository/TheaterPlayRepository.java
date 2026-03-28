package com.example.backend.repository;

import com.example.backend.model.TheaterPlayEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TheaterPlayRepository extends JpaRepository<TheaterPlayEntity, Long> {
    Optional<TheaterPlayEntity> findFirstByActiveTrueOrderByUpdatedAtDesc();
}
