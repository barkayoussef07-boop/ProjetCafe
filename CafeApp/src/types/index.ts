// src/types/index.ts

export type Role = 'CLIENT' | 'COMPTOIRISTE' | 'GERANT';

export type OrderStatus = 'EN_ATTENTE' | 'EN_PREPARATION' | 'PRETE' | 'LIVREE' | 'ANNULEE';

export type PaymentMethod = 'EN_LIGNE' | 'AU_COMPTOIR';

export type PaymentStatus = 'EN_ATTENTE' | 'PAYE';

export interface User {
  id: number;
  nom: string;
  email: string;
  role: Role;
  telephone?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  nom: string;
  email: string;
  role: Role;
}

export interface Category {
  id: number;
  nom: string;
  ordreAffichage?: number;
}

export interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;
  image?: string;
  disponible: boolean;
  categorie: Category;
}

export interface OrderItem {
  id: number;
  produitId: number;
  nomProduit: string;
  quantite: number;
  prixUnitaire: number;
  sousTotal: number;
}

export interface Order {
  id: number;
  clientId: number;
  clientNom: string;
  dateCommande: string;
  statut: OrderStatus;
  modePaiement: PaymentMethod;
  statutPaiement: PaymentStatus;
  sousTotal: number;
  pourcentageRemise: number;
  total: number;
  items: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantite: number;
}

export interface ProductStat {
  nom: string;
  quantiteVendue: number;
}

export interface DailyStats {
  date: string;
  nombreCommandes: number;
  gainJournalier: number;
  produitsPopulaires: ProductStat[];
}

// --- Navigation ---

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type ClientStackParamList = {
  ClientTabs: undefined;
  ProductList: { categoryId: number; categoryNom: string };
  ProductDetail: { product: Product };
  OrderTracking: { orderId: number };
};

export type ClientTabParamList = {
  Menu: undefined;
  Panier: undefined;
  Commandes: undefined;
};

export type ComptoiristeTabParamList = {
  Entrantes: undefined;
  Produits: undefined;
};

export type ComptoiristeStackParamList = {
  ComptoiristeTabs: undefined;
  OrderDetailStaff: { orderId: number };
};

export type GerantTabParamList = {
  Dashboard: undefined;
  Categories: undefined;
  Produits: undefined;
  Utilisateurs: undefined;
};
