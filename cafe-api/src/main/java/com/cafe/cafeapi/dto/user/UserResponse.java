package com.cafe.cafeapi.dto.user;

import com.cafe.cafeapi.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String nom;
    private String email;
    private Role role;
    private String telephone;
}
