package com.cafe.cafeapi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(name = "date_commande", nullable = false)
    private LocalDateTime dateCommande;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus statut;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode_paiement", nullable = false)
    private PaymentMethod modePaiement;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_paiement", nullable = false)
    private PaymentStatus statutPaiement;

    @Column(name = "sous_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal sousTotal;

    @Column(name = "pourcentage_remise", nullable = false)
    @Builder.Default
    private Integer pourcentageRemise = 0;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();
}
