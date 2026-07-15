package com.cafe.cafeapi.dto.order;

import com.cafe.cafeapi.model.OrderStatus;
import com.cafe.cafeapi.model.PaymentMethod;
import com.cafe.cafeapi.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long clientId;
    private String clientNom;
    private LocalDateTime dateCommande;
    private OrderStatus statut;
    private PaymentMethod modePaiement;
    private PaymentStatus statutPaiement;
    private BigDecimal sousTotal;
    private Integer pourcentageRemise;
    private BigDecimal total;
    private List<OrderItemResponse> items;
}
