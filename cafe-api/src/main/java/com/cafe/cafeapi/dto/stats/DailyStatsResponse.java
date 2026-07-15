package com.cafe.cafeapi.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class DailyStatsResponse {
    private LocalDate date;
    private long nombreCommandes;
    private BigDecimal gainJournalier;
    private List<ProductStat> produitsPopulaires;
}
