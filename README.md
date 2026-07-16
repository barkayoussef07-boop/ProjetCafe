# ☕ CaféApp — Application de commande pour café

Application mobile de commande en ligne pour un café, avec **3 rôles** : Client, Comptoiriste, Gérant.

## 📱 Stack technique

| Couche | Technologie |
|---|---|
| Frontend mobile | React Native (TypeScript) |
| Navigation | React Navigation (Native Stack) |
| Requêtes HTTP | Axios |
| Backend | Spring Boot 3.3.x (Java 21) |
| Persistance | Spring Data JPA |
| Base de données | MySQL (via XAMPP) |
| Authentification | JWT (Spring Security) |
| Build backend | Maven |

## 🗂️ Structure du dépôt

```
.
├── cafe-api/              # Backend Spring Boot
│   ├── src/main/java/com/belhadj/cafeapi/
│   │   ├── model/         # Entités JPA (User, Category, Product, Order, OrderItem)
│   │   ├── repository/    # Interfaces Spring Data JPA
│   │   ├── service/       # Logique métier
│   │   ├── controller/    # Endpoints REST
│   │   └── security/      # Configuration JWT / rôles
│   └── src/main/resources/
│       └── application.properties
│
└── CafeApp/                # Frontend React Native
    └── src/
        ├── api/            # Appels HTTP vers le backend
        ├── screens/        # Écrans (par rôle : client, comptoiriste, gérant)
        ├── navigation/      # Configuration de la navigation
        └── types/          # Types TypeScript
```

## 👥 Rôles et fonctionnalités

### Client
- Inscription / connexion (compte obligatoire)
- Consultation du menu par catégorie
- Ajout au panier et commande
- Paiement en ligne ou au comptoir
- Suivi du statut de commande en temps réel
- Historique des commandes

### Comptoiriste
- Suivi des commandes entrantes
- Mise à jour du statut des commandes (en préparation → prête → livrée)
- Validation des paiements au comptoir
- Gestion de la disponibilité des produits (marquer épuisé)

### Gérant
- Gestion du menu (produits, catégories)
- Gestion des comptes utilisateurs
- Statistiques : ventes, produits populaires, gain journalier

## ⚙️ Prérequis

- Java 21 (Eclipse Temurin recommandé)
- Maven 3.9+
- Node.js 20+ LTS
- React Native CLI (`npm install -g react-native`)
- Android Studio + SDK (API 34 minimum) + émulateur configuré
- XAMPP (module MySQL démarré)

## 🚀 Lancer le projet en local

### 1. Base de données
```bash
# Démarrer XAMPP, activer le module MySQL
# Créer la base via phpMyAdmin :
CREATE DATABASE cafe_db;
```

### 2. Backend (Spring Boot)
```bash
cd cafe-api
mvn spring-boot:run
```
API disponible sur `http://localhost:8080`

### 3. Frontend (React Native)
```bash
cd CafeApp
npm install

# Terminal 1 — Metro bundler
npx react-native start

# Terminal 2 — lancer sur Android (émulateur démarré au préalable)
npx react-native run-android
```

> ⚠️ Sur l'émulateur Android, `localhost` fait référence à l'émulateur lui-même, pas à la machine hôte. Utiliser `10.0.2.2` pour atteindre le backend depuis l'app.

## Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Gérant | admin@cafe.com | admin123 |
| Client | à créer via "Créer un compte" dans l'app | — |
| Comptoiriste | créé par le gérant depuis l'onglet "Utilisateurs" | — |

```
