package com.eventra.backend.service;

import com.eventra.backend.entity.Ticket;
import com.eventra.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Ticket createTicket(Ticket ticket) {
        String ticketCode =
                "EVENTRA-TICKET-" + UUID.randomUUID();

        ticket.setTicketCode(ticketCode);
        ticket.setUsed(false);

        return ticketRepository.save(ticket);
    }

    public List<Ticket> getTicketsByUserId(Long userId) {
        return ticketRepository.findByUserId(userId);
    }

    public Optional<Ticket> getTicketByCode(
            String ticketCode
    ) {
        return ticketRepository.findByTicketCode(ticketCode);
    }

    public TicketCheckInResult checkInTicket(
            String ticketCode
    ) {
        Optional<Ticket> ticketOptional =
                ticketRepository.findByTicketCode(ticketCode);

        if (ticketOptional.isEmpty()) {
            return new TicketCheckInResult(
                    "INVALID",
                    null
            );
        }

        Ticket ticket = ticketOptional.get();

        if (ticket.isUsed()) {
            return new TicketCheckInResult(
                    "ALREADY_USED",
                    ticket
            );
        }

        ticket.setUsed(true);

        Ticket updatedTicket =
                ticketRepository.save(ticket);

        return new TicketCheckInResult(
                "CHECKED_IN",
                updatedTicket
        );
    }
}