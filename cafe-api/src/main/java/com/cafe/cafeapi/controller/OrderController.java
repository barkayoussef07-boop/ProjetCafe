package com.cafe.cafeapi.controller;

import com.cafe.cafeapi.dto.order.CreateOrderRequest;
import com.cafe.cafeapi.dto.order.OrderResponse;
import com.cafe.cafeapi.dto.order.UpdateOrderStatusRequest;
import com.cafe.cafeapi.model.User;
import com.cafe.cafeapi.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // POST /api/orders - CLIENT uniquement : passer une commande
    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<OrderResponse> create(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        return ResponseEntity.ok(orderService.create(currentUser, request));
    }

    // GET /api/orders/me - CLIENT : historique de ses propres commandes
    @GetMapping("/me")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.findMyOrders(currentUser.getId()));
    }

    // GET /api/orders - COMPTOIRISTE/GERANT : toutes les commandes
    @GetMapping
    @PreAuthorize("hasAnyRole('COMPTOIRISTE', 'GERANT')")
    public ResponseEntity<List<OrderResponse>> getAll() {
        return ResponseEntity.ok(orderService.findAll());
    }

    // GET /api/orders/entrantes - COMPTOIRISTE/GERANT : commandes non terminees (a preparer/servir)
    @GetMapping("/entrantes")
    @PreAuthorize("hasAnyRole('COMPTOIRISTE', 'GERANT')")
    public ResponseEntity<List<OrderResponse>> getEntrantes() {
        return ResponseEntity.ok(orderService.findEntrantes());
    }

    // GET /api/orders/{id} - le client proprietaire, ou COMPTOIRISTE/GERANT (suivi de commande)
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getById(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(orderService.findById(id, currentUser));
    }

    // PATCH /api/orders/{id}/statut - COMPTOIRISTE/GERANT : EN_ATTENTE -> EN_PREPARATION -> PRETE -> LIVREE
    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('COMPTOIRISTE', 'GERANT')")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatut()));
    }

    // PATCH /api/orders/{id}/paiement - COMPTOIRISTE/GERANT : valider un paiement (comptoir ou en ligne)
    @PatchMapping("/{id}/paiement")
    @PreAuthorize("hasAnyRole('COMPTOIRISTE', 'GERANT')")
    public ResponseEntity<OrderResponse> validatePayment(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.validatePayment(id));
    }
}
