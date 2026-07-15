package com.cafe.cafeapi.dto.category;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {

    @NotBlank(message = "Le nom de la categorie est obligatoire")
    private String nom;

    private Integer ordreAffichage;
}
