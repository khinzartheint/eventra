package com.eventra.backend.repository;

import com.eventra.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByOrganizerId(Long organizerId);

    List<Event> findByCategoryIgnoreCase(String category);

    long countByOrganizerId(Long organizerId);
}