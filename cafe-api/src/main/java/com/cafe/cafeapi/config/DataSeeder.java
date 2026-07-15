package com.cafe.cafeapi.config;

import com.cafe.cafeapi.model.Role;
import com.cafe.cafeapi.model.User;
import com.cafe.cafeapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cree le premier compte GERANT au demarrage si aucun n'existe encore.
 * Necessaire car l'inscription publique (/api/auth/register) ne cree que des comptes CLIENT.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.gerant.email}")
    private String gerantEmail;

    @Value("${app.seed.gerant.password}")
    private String gerantPassword;

    @Value("${app.seed.gerant.nom}")
    private String gerantNom;

    @Override
    public void run(String... args) {
        boolean aucunGerant = userRepository.findByRole(Role.GERANT).isEmpty();

        if (aucunGerant) {
            User gerant = User.builder()
                    .nom(gerantNom)
                    .email(gerantEmail)
                    .motDePasse(passwordEncoder.encode(gerantPassword))
                    .role(Role.GERANT)
                    .build();

            userRepository.save(gerant);

            System.out.println("=================================================");
            System.out.println("Compte GERANT par defaut cree :");
            System.out.println("  email    : " + gerantEmail);
            System.out.println("  password : " + gerantPassword);
            System.out.println("  -> Changez ce mot de passe des que possible.");
            System.out.println("=================================================");
        }
    }
}
