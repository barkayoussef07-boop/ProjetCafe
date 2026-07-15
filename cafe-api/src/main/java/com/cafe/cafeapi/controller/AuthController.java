package com.cafe.cafeapi.controller;

import com.cafe.cafeapi.dto.auth.AuthResponse;
import com.cafe.cafeapi.dto.auth.LoginRequest;
import com.cafe.cafeapi.dto.auth.RegisterRequest;
import com.cafe.cafeapi.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register - inscription publique, cree toujours un compte CLIENT
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // POST /api/auth/login - connexion pour les 3 roles (CLIENT, COMPTOIRISTE, GERANT)
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
