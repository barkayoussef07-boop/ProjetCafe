package com.cafe.cafeapi.service;

import com.cafe.cafeapi.dto.order.CreateOrderRequest;
import com.cafe.cafeapi.dto.order.OrderItemRequest;
import com.cafe.cafeapi.dto.order.OrderItemResponse;
import com.cafe.cafeapi.dto.order.OrderResponse;
import com.cafe.cafeapi.exception.BadRequestException;
import com.cafe.cafeapi.exception.ResourceNotFoundException;
import com.cafe.cafeapi.model.*;
import com.cafe.cafeapi.repository.OrderRepository;
import com.cafe.cafeapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    // Remise de bienvenue sur la toute premiere commande d'un client
    private static final int REMISE_BIENVENUE_POURCENT = 10;
    // Remise volume au-dela d'une quantite totale de produits dans la commande
    private static final int REMISE_VOLUME_POURCENT = 15;
    private static final int SEUIL_QUANTITE_GROSSE_COMMANDE = 10;

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponse create(User client, CreateOrderRequest request) {
        Order order = Order.builder()
                .client(client)
                .dateCommande(LocalDateTime.now())
                .statut(OrderStatus.EN_ATTENTE)
                .modePaiement(request.getModePaiement())
                .statutPaiement(PaymentStatus.EN_ATTENTE)
                .build();

        BigDecimal sousTotal = BigDecimal.ZERO;
        int quantiteTotale = 0;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProduitId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + itemRequest.getProduitId()));

            if (!Boolean.TRUE.equals(product.getDisponible())) {
                throw new BadRequestException("Le produit '" + product.getNom() + "' n'est plus disponible");
            }

            BigDecimal sousTotalLigne = product.getPrix().multiply(BigDecimal.valueOf(itemRequest.getQuantite()));
            sousTotal = sousTotal.add(sousTotalLigne);
            quantiteTotale += itemRequest.getQuantite();

            OrderItem item = OrderItem.builder()
                    .commande(order)
                    .produit(product)
                    .quantite(itemRequest.getQuantite())
                    .prixUnitaire(product.getPrix())
                    .build();

            order.getItems().add(item);
        }

        boolean premiereCommande = orderRepository.findByClientIdOrderByDateCommandeDesc(client.getId()).isEmpty();
        boolean grosseCommande = quantiteTotale >= SEUIL_QUANTITE_GROSSE_COMMANDE;

        // Les deux remises ne se cumulent pas : seule la plus avantageuse s'applique
        int pourcentageRemise = Math.max(
                premiereCommande ? REMISE_BIENVENUE_POURCENT : 0,
                grosseCommande ? REMISE_VOLUME_POURCENT : 0
        );

        BigDecimal facteurRemise = BigDecimal.ONE.subtract(
                BigDecimal.valueOf(pourcentageRemise).divide(BigDecimal.valueOf(100))
        );
        BigDecimal total = sousTotal.multiply(facteurRemise).setScale(2, RoundingMode.HALF_UP);

        order.setSousTotal(sousTotal);
        order.setPourcentageRemise(pourcentageRemise);
        order.setTotal(total);

        return toResponse(orderRepository.save(order));
    }

    public List<OrderResponse> findMyOrders(Long clientId) {
        return orderRepository.findByClientIdOrderByDateCommandeDesc(clientId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<OrderResponse> findAll() {
        return orderRepository.findAllByOrderByDateCommandeDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<OrderResponse> findEntrantes() {
        return orderRepository.findByStatutNotOrderByDateCommandeDesc(OrderStatus.LIVREE).stream()
                .filter(o -> o.getStatut() != OrderStatus.ANNULEE)
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse findById(Long id, User currentUser) {
        Order order = getEntity(id);

        boolean isOwner = order.getClient().getId().equals(currentUser.getId());
        boolean isStaff = currentUser.getRole() == Role.COMPTOIRISTE || currentUser.getRole() == Role.GERANT;

        if (!isOwner && !isStaff) {
            throw new AccessDeniedException("Vous n'avez pas acces a cette commande");
        }

        return toResponse(order);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatus statut) {
        Order order = getEntity(id);
        order.setStatut(statut);
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse validatePayment(Long id) {
        Order order = getEntity(id);
        order.setStatutPaiement(PaymentStatus.PAYE);
        return toResponse(orderRepository.save(order));
    }

    private Order getEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable : " + id));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .produitId(item.getProduit().getId())
                        .nomProduit(item.getProduit().getNom())
                        .quantite(item.getQuantite())
                        .prixUnitaire(item.getPrixUnitaire())
                        .sousTotal(item.getPrixUnitaire().multiply(BigDecimal.valueOf(item.getQuantite())))
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .clientId(order.getClient().getId())
                .clientNom(order.getClient().getNom())
                .dateCommande(order.getDateCommande())
                .statut(order.getStatut())
                .modePaiement(order.getModePaiement())
                .statutPaiement(order.getStatutPaiement())
                .sousTotal(order.getSousTotal())
                .pourcentageRemise(order.getPourcentageRemise())
                .total(order.getTotal())
                .items(items)
                .build();
    }
}
