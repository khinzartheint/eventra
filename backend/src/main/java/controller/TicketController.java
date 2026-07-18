package com.eventra.backend.controller;

import com.eventra.backend.entity.Ticket;
import com.eventra.backend.service.TicketCheckInResult;
import com.eventra.backend.service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @RequestBody Ticket ticket
    ) {
        Ticket savedTicket =
                ticketService.createTicket(ticket);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedTicket);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Ticket>> getTicketsByUser(
            @PathVariable Long userId
    ) {
        List<Ticket> tickets =
                ticketService.getTicketsByUserId(userId);

        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/code/{ticketCode}")
    public ResponseEntity<?> getTicketByCode(
            @PathVariable String ticketCode
    ) {
        Optional<Ticket> ticketOptional =
                ticketService.getTicketByCode(ticketCode);

        if (ticketOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    "Ticket not found"
                            )
                    );
        }

        return ResponseEntity.ok(ticketOptional.get());
    }

    @PatchMapping("/check-in/{ticketCode}")
    public ResponseEntity<?> checkInTicket(
            @PathVariable String ticketCode
    ) {
        TicketCheckInResult result =
                ticketService.checkInTicket(ticketCode);

        if ("INVALID".equals(result.getStatus())) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid ticket"
                            )
                    );
        }

        if ("ALREADY_USED".equals(result.getStatus())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            Map.of(
                                    "message",
                                    "Ticket already used",
                                    "ticket",
                                    result.getTicket()
                            )
                    );
        }

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Ticket checked in successfully",
                        "ticket",
                        result.getTicket()
                )
        );
    }
}