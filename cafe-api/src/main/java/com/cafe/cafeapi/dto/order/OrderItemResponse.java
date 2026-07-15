package com.cafe.cafeapi.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private Long produitId;
    private String nomProduit;
    private Integer quantite;
    private BigDecimal prixUnitaire;
    private BigDecimal sousTotal;
}
