package com.eventra.backend.service;

import com.eventra.backend.entity.Event;
import com.eventra.backend.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event createEvent(Event event) {
        event.setAvailableTickets(event.getTotalTickets());

        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public List<Event> getEventsByOrganizerId(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId);
    }

    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByCategoryIgnoreCase(category);
    }

    public long getOrganizerEventCount(Long organizerId) {
        return eventRepository.countByOrganizerId(organizerId);
    }

    public Optional<Event> updateEvent(
            Long id,
            Event updatedEvent
    ) {
        Optional<Event> existingEventOptional =
                eventRepository.findById(id);

        if (existingEventOptional.isEmpty()) {
            return Optional.empty();
        }

        Event existingEvent = existingEventOptional.get();

        int soldTickets =
                existingEvent.getTotalTickets()
                        - existingEvent.getAvailableTickets();

        if (updatedEvent.getTotalTickets() < soldTickets) {
            throw new IllegalArgumentException(
                    "Total tickets cannot be lower than tickets already sold"
            );
        }

        existingEvent.setTitle(updatedEvent.getTitle());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setLocation(updatedEvent.getLocation());
        existingEvent.setEventDate(updatedEvent.getEventDate());
        existingEvent.setCategory(updatedEvent.getCategory());
        existingEvent.setImageUrl(updatedEvent.getImageUrl());
        existingEvent.setPrice(updatedEvent.getPrice());
        existingEvent.setOrganizerId(updatedEvent.getOrganizerId());
        existingEvent.setTotalTickets(updatedEvent.getTotalTickets());

        existingEvent.setAvailableTickets(
                updatedEvent.getTotalTickets() - soldTickets
        );

        Event savedEvent = eventRepository.save(existingEvent);

        return Optional.of(savedEvent);
    }

    public boolean deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            return false;
        }

        eventRepository.deleteById(id);

        return true;
    }
}