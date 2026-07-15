package com.cafe.cafeapi.dto.category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private String nom;
    private Integer ordreAffichage;
}
