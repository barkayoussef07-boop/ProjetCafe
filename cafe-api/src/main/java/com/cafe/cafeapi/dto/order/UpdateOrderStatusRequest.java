package com.cafe.cafeapi.dto.order;

import com.cafe.cafeapi.model.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {

    @NotNull(message = "Le statut est obligatoire")
    private OrderStatus statut;
}
