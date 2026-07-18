package com.eventra.backend.service;

import com.eventra.backend.entity.Ticket;

public class TicketCheckInResult {

    private final String status;
    private final Ticket ticket;

    public TicketCheckInResult(String status, Ticket ticket) {
        this.status = status;
        this.ticket = ticket;
    }

    public String getStatus() {
        return status;
    }

    public Ticket getTicket() {
        return ticket;
    }
}