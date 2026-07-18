package com.eventra.backend.service;

import com.eventra.backend.dto.DashboardResponse;
import com.eventra.backend.entity.Event;
import com.eventra.backend.entity.Ticket;
import com.eventra.backend.repository.EventRepository;
import com.eventra.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;

    public DashboardService(
            TicketRepository ticketRepository,
            EventRepository eventRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.eventRepository = eventRepository;
    }

    public DashboardResponse getDashboardStatistics(
            Long organizerId
    ) {
        List<Event> organizerEvents =
                eventRepository.findByOrganizerId(organizerId);

        long totalEvents = organizerEvents.size();

        if (organizerEvents.isEmpty()) {
            return new DashboardResponse(
                    0,
                    0,
                    0.0
            );
        }

        List<Long> organizerEventIds =
                organizerEvents
                        .stream()
                        .map(Event::getId)
                        .toList();

        List<Ticket> organizerTickets =
                ticketRepository.findByEventIdIn(
                        organizerEventIds
                );

        long totalTickets = organizerTickets.size();

        double totalRevenue =
                organizerTickets
                        .stream()
                        .filter(ticket ->
                                ticket.getPrice() != null
                        )
                        .mapToDouble(Ticket::getPrice)
                        .sum();

        return new DashboardResponse(
                totalEvents,
                totalTickets,
                totalRevenue
        );
    }
}