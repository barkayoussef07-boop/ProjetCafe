package com.cafe.cafeapi.dto.auth;

import com.cafe.cafeapi.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String nom;
    private String email;
    private Role role;
}
