package com.eventra.backend.controller;

import com.eventra.backend.dto.DashboardResponse;
import com.eventra.backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{organizerId}")
    public ResponseEntity<DashboardResponse>
    getDashboardStatistics(
            @PathVariable Long organizerId
    ) {
        DashboardResponse response =
                dashboardService.getDashboardStatistics(
                        organizerId
                );

        return ResponseEntity.ok(response);
    }
}