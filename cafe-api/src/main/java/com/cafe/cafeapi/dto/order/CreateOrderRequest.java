package com.cafe.cafeapi.dto.order;

import com.cafe.cafeapi.model.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotEmpty(message = "La commande doit contenir au moins un produit")
    @Valid
    private List<OrderItemRequest> items;

    @NotNull(message = "Le mode de paiement est obligatoire")
    private PaymentMethod modePaiement;
}
