package com.cafe.cafeapi.service;

import com.cafe.cafeapi.dto.auth.AuthResponse;
import com.cafe.cafeapi.dto.auth.LoginRequest;
import com.cafe.cafeapi.dto.auth.RegisterRequest;
import com.cafe.cafeapi.exception.BadRequestException;
import com.cafe.cafeapi.model.Role;
import com.cafe.cafeapi.model.User;
import com.cafe.cafeapi.repository.UserRepository;
import com.cafe.cafeapi.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Inscription publique : ne cree que des comptes CLIENT.
     * Les comptes COMPTOIRISTE/GERANT sont crees par un GERANT via UserService.
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Un compte existe deja avec cet email");
        }

        User user = User.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(Role.CLIENT)
                .telephone(request.getTelephone())
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return toAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Email ou mot de passe incorrect"));

        String token = jwtService.generateToken(user);
        return toAuthResponse(user, token);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .nom(user.getNom())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
