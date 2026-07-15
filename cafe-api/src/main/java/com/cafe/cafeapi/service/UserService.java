package com.cafe.cafeapi.service;

import com.cafe.cafeapi.dto.user.CreateUserRequest;
import com.cafe.cafeapi.dto.user.UserResponse;
import com.cafe.cafeapi.exception.BadRequestException;
import com.cafe.cafeapi.exception.ResourceNotFoundException;
import com.cafe.cafeapi.model.User;
import com.cafe.cafeapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Un compte existe deja avec cet email");
        }

        User user = User.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(request.getRole())
                .telephone(request.getTelephone())
                .build();

        return toResponse(userRepository.save(user));
    }

    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Utilisateur introuvable : " + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .nom(user.getNom())
                .email(user.getEmail())
                .role(user.getRole())
                .telephone(user.getTelephone())
                .build();
    }
}
