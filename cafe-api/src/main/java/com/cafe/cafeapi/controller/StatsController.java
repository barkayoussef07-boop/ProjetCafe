package com.cafe.cafeapi.controller;

import com.cafe.cafeapi.dto.stats.DailyStatsResponse;
import com.cafe.cafeapi.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Statistiques - GERANT uniquement
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@PreAuthorize("hasRole('GERANT')")
public class StatsController {

    private final StatsService statsService;

    // GET /api/stats/daily - commandes du jour + gain journalier + produits populaires
    @GetMapping("/daily")
    public ResponseEntity<DailyStatsResponse> getDailyStats() {
        return ResponseEntity.ok(statsService.getDailyStats());
    }
}
