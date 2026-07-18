package com.eventra.backend.dto;

public class DashboardResponse {

    private long totalEvents;
    private long totalTickets;
    private double totalRevenue;

    public DashboardResponse() {
    }

    public DashboardResponse(long totalEvents, long totalTickets, double totalRevenue) {
        this.totalEvents = totalEvents;
        this.totalTickets = totalTickets;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(long totalTickets) {
        this.totalTickets = totalTickets;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}