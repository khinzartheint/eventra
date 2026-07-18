package com.eventra.backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(name = "event_date", nullable = false)
    private String eventDate;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "total_tickets", nullable = false)
    private Integer totalTickets;

    @Column(name = "available_tickets", nullable = false)
    private Integer availableTickets;

    @Column(name = "organizer_id", nullable = false)
    private Long organizerId;

    public Event() {
    }

    public Event(
            Long id,
            String title,
            String description,
            String location,
            String eventDate,
            String category,
            String imageUrl,
            BigDecimal price,
            Integer totalTickets,
            Integer availableTickets,
            Long organizerId
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.eventDate = eventDate;
        this.category = category;
        this.imageUrl = imageUrl;
        this.price = price;
        this.totalTickets = totalTickets;
        this.availableTickets = availableTickets;
        this.organizerId = organizerId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(Integer totalTickets) {
        this.totalTickets = totalTickets;
    }

    public Integer getAvailableTickets() {
        return availableTickets;
    }

    public void setAvailableTickets(Integer availableTickets) {
        this.availableTickets = availableTickets;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }
}