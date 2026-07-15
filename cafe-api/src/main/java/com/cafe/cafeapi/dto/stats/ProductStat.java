package com.cafe.cafeapi.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ProductStat {
    private String nom;
    private long quantiteVendue;
}
