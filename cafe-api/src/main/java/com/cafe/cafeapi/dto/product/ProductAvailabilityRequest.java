package com.cafe.cafeapi.dto.product;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductAvailabilityRequest {

    @NotNull(message = "Le champ disponible est obligatoire")
    private Boolean disponible;
}
