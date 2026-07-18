package com.eventra.backend.controller;

import com.eventra.backend.entity.Event;
import com.eventra.backend.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(
            @RequestBody Event event
    ) {
        Event savedEvent = eventService.createEvent(event);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedEvent);
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(
                eventService.getAllEvents()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(
            @PathVariable Long id
    ) {
        Optional<Event> eventOptional =
                eventService.getEventById(id);

        if (eventOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    "Event not found"
                            )
                    );
        }

        return ResponseEntity.ok(
                eventOptional.get()
        );
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(
            @PathVariable Long organizerId
    ) {
        return ResponseEntity.ok(
                eventService.getEventsByOrganizerId(organizerId)
        );
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Event>> getEventsByCategory(
            @PathVariable String category
    ) {
        return ResponseEntity.ok(
                eventService.getEventsByCategory(category)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestBody Event updatedEvent
    ) {
        try {
            Optional<Event> updatedEventOptional =
                    eventService.updateEvent(id, updatedEvent);

            if (updatedEventOptional.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "Event not found"
                                )
                        );
            }

            return ResponseEntity.ok(
                    updatedEventOptional.get()
            );

        } catch (IllegalArgumentException error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            Map.of(
                                    "message",
                                    error.getMessage()
                            )
                    );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable Long id
    ) {
        boolean deleted =
                eventService.deleteEvent(id);

        if (!deleted) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    "Event not found"
                            )
                    );
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Event deleted successfully"
                )
        );
    }
}