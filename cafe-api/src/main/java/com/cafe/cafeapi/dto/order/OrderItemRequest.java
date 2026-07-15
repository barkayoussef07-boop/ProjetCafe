package com.cafe.cafeapi.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemRequest {

    @NotNull(message = "Le produit est obligatoire")
    private Long produitId;

    @NotNull(message = "La quantite est obligatoire")
    @Min(value = 1, message = "La quantite doit etre au moins 1")
    private Integer quantite;
}
