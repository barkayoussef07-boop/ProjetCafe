package com.cafe.cafeapi.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    @NotBlank(message = "Le nom du produit est obligatoire")
    private String nom;

    private String description;

    @NotNull(message = "Le prix est obligatoire")
    @Positive(message = "Le prix doit etre positif")
    private BigDecimal prix;

    private String image;

    private Boolean disponible;

    @NotNull(message = "La categorie est obligatoire")
    private Long categorieId;
}
