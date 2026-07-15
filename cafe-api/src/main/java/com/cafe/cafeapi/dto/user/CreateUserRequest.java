package com.cafe.cafeapi.dto.user;

import com.cafe.cafeapi.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Utilise par le GERANT pour creer un compte COMPTOIRISTE (ou un autre GERANT).
 */
@Data
public class CreateUserRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caracteres")
    private String motDePasse;

    @NotNull(message = "Le role est obligatoire")
    private Role role;

    private String telephone;
}
