// src/screens/client/CartScreen.tsx
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { extractErrorMessage } from '../../api/client';
import { createOrder, fetchMyOrders } from '../../api/ordersApi';
import { useCart } from '../../context/CartContext';
import { ClientStackParamList, PaymentMethod } from '../../types';

// Regles de remise (doivent rester coherentes avec OrderService cote backend,
// qui est la seule source de verite pour le calcul reel applique a la commande)
const SEUIL_GROSSE_COMMANDE = 10;

export function CartScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ClientStackParamList>>();
  const { items, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const [modePaiement, setModePaiement] = useState<PaymentMethod>('AU_COMPTOIR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasOrderedBefore, setHasOrderedBefore] = useState<boolean | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchMyOrders()
        .then((orders) => setHasOrderedBefore(orders.length > 0))
        .catch(() => setHasOrderedBefore(null));
    }, [])
  );

  const quantiteTotale = items.reduce((sum, item) => sum + item.quantite, 0);
  const eligibleGrosseCommande = quantiteTotale >= SEUIL_GROSSE_COMMANDE;
  const eligibleBienvenue = hasOrderedBefore === false;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      const order = await createOrder({
        items: items.map((item) => ({ produitId: item.product.id, quantite: item.quantite })),
        modePaiement,
      });
      clearCart();
      navigation.navigate('OrderTracking', { orderId: order.id });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <Text style={styles.emptyText}>Votre panier est vide.</Text>
        <Text style={styles.emptySubtext}>Ajoutez des produits depuis le menu.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {eligibleGrosseCommande && (
        <View style={styles.promoBanner}>
          <Text style={styles.promoText}>
            🎉 -15% appliqués automatiquement : votre commande atteint {SEUIL_GROSSE_COMMANDE} produits ou plus !
          </Text>
        </View>
      )}
      {!eligibleGrosseCommande && eligibleBienvenue && (
        <View style={styles.promoBanner}>
          <Text style={styles.promoText}>🎉 -10% de remise sur votre première commande !</Text>
        </View>
      )}
      {!eligibleGrosseCommande && !eligibleBienvenue && hasOrderedBefore === true && (
        <View style={styles.hintBanner}>
          <Text style={styles.hintText}>
            💡 Encore {SEUIL_GROSSE_COMMANDE - quantiteTotale} produit(s) et vous obtenez -15% de remise !
          </Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>{item.product.nom}</Text>
              <Text style={styles.rowPrice}>{item.product.prix.toFixed(2)} DT</Text>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.product.id, item.quantite - 1)}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{item.quantite}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.product.id, item.quantite + 1)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
                <Text style={styles.removeText}>Retirer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.label}>Mode de paiement</Text>
        <View style={styles.paymentRow}>
          <TouchableOpacity
            style={[styles.paymentBtn, modePaiement === 'AU_COMPTOIR' && styles.paymentBtnActive]}
            onPress={() => setModePaiement('AU_COMPTOIR')}
          >
            <Text style={[styles.paymentText, modePaiement === 'AU_COMPTOIR' && styles.paymentTextActive]}>
              Au comptoir
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentBtn, modePaiement === 'EN_LIGNE' && styles.paymentBtnActive]}
            onPress={() => setModePaiement('EN_LIGNE')}
          >
            <Text style={[styles.paymentText, modePaiement === 'EN_LIGNE' && styles.paymentTextActive]}>
              En ligne
            </Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.checkoutText}>Valider la commande — {total.toFixed(2)} DT</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1EA' },
  list: { padding: 16 },
  row: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
  },
  rowInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#0D1B2A' },
  rowPrice: { fontSize: 14, color: '#C97B3D', fontWeight: 'bold' },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 16, fontWeight: 'bold', color: '#0D1B2A' },
  qtyValue: { fontSize: 15, fontWeight: 'bold', marginHorizontal: 14, color: '#0D1B2A' },
  removeText: { color: '#B71C1C', fontSize: 12, marginLeft: 'auto' },
  promoBanner: {
    backgroundColor: '#0D1B2A', marginHorizontal: 16, marginTop: 12, borderRadius: 10, padding: 12,
  },
  promoText: { color: '#F2C9A0', fontWeight: '700', fontSize: 13, textAlign: 'center' },
  hintBanner: {
    backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 12, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: '#E7DCC9',
  },
  hintText: { color: '#7A5B36', fontWeight: '600', fontSize: 12.5, textAlign: 'center' },
  footer: { padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginBottom: 8 },
  paymentRow: { flexDirection: 'row', marginBottom: 14 },
  paymentBtn: {
    flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1',
    alignItems: 'center', marginRight: 8,
  },
  paymentBtnActive: { backgroundColor: '#0D1B2A', borderColor: '#0D1B2A' },
  paymentText: { color: '#0D1B2A', fontWeight: '600' },
  paymentTextActive: { color: '#FFFFFF' },
  checkoutBtn: { backgroundColor: '#C97B3D', borderRadius: 10, padding: 16, alignItems: 'center' },
  checkoutText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  errorText: { color: '#B71C1C', textAlign: 'center', marginBottom: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F1EA' },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#0D1B2A' },
  emptySubtext: { fontSize: 13, color: '#64748B', marginTop: 6 },
});
