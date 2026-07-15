package com.cafe.cafeapi.dto.product;

import com.cafe.cafeapi.dto.category.CategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String nom;
    private String description;
    private BigDecimal prix;
    private String image;
    private Boolean disponible;
    private CategoryResponse categorie;
}
