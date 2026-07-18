package com.eventra.backend.repository;

import com.eventra.backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository
        extends JpaRepository<Ticket, Long> {

    List<Ticket> findByUserId(Long userId);

    Optional<Ticket> findByTicketCode(String ticketCode);

    List<Ticket> findByEventIdIn(List<Long> eventIds);

    long countByUsedTrue();

    long countByUsedFalse();
}