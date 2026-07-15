package com.cafe.cafeapi.service;

import com.cafe.cafeapi.dto.stats.DailyStatsResponse;
import com.cafe.cafeapi.dto.stats.ProductStat;
import com.cafe.cafeapi.model.Order;
import com.cafe.cafeapi.model.OrderStatus;
import com.cafe.cafeapi.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final OrderRepository orderRepository;

    public DailyStatsResponse getDailyStats() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        List<Order> ordersToday = orderRepository.findByDateCommandeBetween(start, end).stream()
                .filter(o -> o.getStatut() != OrderStatus.ANNULEE)
                .toList();

        BigDecimal gainJournalier = ordersToday.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<ProductStat> produitsPopulaires = orderRepository.findAll().stream()
                .filter(o -> o.getStatut() != OrderStatus.ANNULEE)
                .flatMap(o -> o.getItems().stream())
                .collect(Collectors.groupingBy(
                        item -> item.getProduit().getNom(),
                        Collectors.summingLong(item -> item.getQuantite())
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> ProductStat.builder().nom(e.getKey()).quantiteVendue(e.getValue()).build())
                .toList();

        return DailyStatsResponse.builder()
                .date(today)
                .nombreCommandes(ordersToday.size())
                .gainJournalier(gainJournalier)
                .produitsPopulaires(produitsPopulaires)
                .build();
    }
}
