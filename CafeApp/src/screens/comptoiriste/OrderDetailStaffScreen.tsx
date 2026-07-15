// src/screens/comptoiriste/OrderDetailStaffScreen.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { extractErrorMessage } from '../../api/client';
import { fetchOrderById, updateOrderStatus, validateOrderPayment } from '../../api/ordersApi';
import { ComptoiristeStackParamList, Order, OrderStatus } from '../../types';

type Props = NativeStackScreenProps<ComptoiristeStackParamList, 'OrderDetailStaff'>;

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  EN_ATTENTE: 'EN_PREPARATION',
  EN_PREPARATION: 'PRETE',
  PRETE: 'LIVREE',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  EN_ATTENTE: 'En attente',
  EN_PREPARATION: 'En preparation',
  PRETE: 'Prete',
  LIVREE: 'Livree',
  ANNULEE: 'Annulee',
};

export function OrderDetailStaffScreen({ route }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [orderId]);

  const load = async () => {
    try {
      setError(null);
      const data = await fetchOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  const handleAdvanceStatus = async () => {
    if (!order) return;
    const next = NEXT_STATUS[order.statut];
    if (!next) return;
    try {
      setBusy(true);
      const updated = await updateOrderStatus(order.id, next);
      setOrder(updated);
    } catch (err) {
      Alert.alert('Erreur', extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    try {
      setBusy(true);
      const updated = await updateOrderStatus(order.id, 'ANNULEE');
      setOrder(updated);
    } catch (err) {
      Alert.alert('Erreur', extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleValidatePayment = async () => {
    if (!order) return;
    try {
      setBusy(true);
      const updated = await validateOrderPayment(order.id);
      setOrder(updated);
    } catch (err) {
      Alert.alert('Erreur', extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C97B3D" />
      </View>
    );
  }

  const next = NEXT_STATUS[order.statut];
  const isFinal = order.statut === 'LIVREE' || order.statut === 'ANNULEE';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Commande #{order.id}</Text>
      <Text style={styles.subtitle}>Client : {order.clientNom}</Text>
      <Text style={styles.subtitle}>Statut actuel : {STATUS_LABELS[order.statut]}</Text>

      <Text style={styles.label}>Articles</Text>
      {order.items.map((item) => (
        <Text key={item.id} style={styles.itemLine}>
          {item.quantite} x {item.nomProduit} — {item.sousTotal.toFixed(2)} DT
        </Text>
      ))}
      {order.pourcentageRemise > 0 ? (
        <>
          <Text style={styles.itemLine}>Sous-total : {order.sousTotal.toFixed(2)} DT</Text>
          <Text style={styles.discount}>Remise -{order.pourcentageRemise}% : -{(order.sousTotal - order.total).toFixed(2)} DT</Text>
          <Text style={styles.total}>Total payé : {order.total.toFixed(2)} DT</Text>
        </>
      ) : (
        <Text style={styles.total}>Total : {order.total.toFixed(2)} DT</Text>
      )}

      <Text style={styles.label}>Paiement</Text>
      <Text style={styles.value}>
        {order.modePaiement === 'EN_LIGNE' ? 'En ligne' : 'Au comptoir'} — {order.statutPaiement === 'PAYE' ? 'Paye' : 'En attente'}
      </Text>
      {order.statutPaiement === 'EN_ATTENTE' && (
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleValidatePayment} disabled={busy}>
          <Text style={styles.secondaryBtnText}>Valider le paiement</Text>
        </TouchableOpacity>
      )}

      {!isFinal && (
        <>
          {next && (
            <TouchableOpacity style={styles.primaryBtn} onPress={handleAdvanceStatus} disabled={busy}>
              {busy ? <ActivityIndicator color="#FFFFFF" /> : (
                <Text style={styles.primaryBtnText}>Marquer comme "{STATUS_LABELS[next]}"</Text>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} disabled={busy}>
            <Text style={styles.cancelBtnText}>Annuler la commande</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1EA' },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0D1B2A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginTop: 20, marginBottom: 6 },
  value: { fontSize: 14, color: '#0D1B2A' },
  itemLine: { fontSize: 14, color: '#0D1B2A', marginBottom: 4 },
  discount: { fontSize: 14, color: '#C97B3D', fontWeight: '700', marginBottom: 4 },
  total: { fontSize: 16, fontWeight: 'bold', color: '#C97B3D', marginTop: 8 },
  primaryBtn: { backgroundColor: '#0D1B2A', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 28 },
  primaryBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  secondaryBtn: { backgroundColor: '#C97B3D', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 12 },
  secondaryBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  cancelBtn: { padding: 14, alignItems: 'center', marginTop: 12 },
  cancelBtnText: { color: '#B71C1C', fontWeight: '600', fontSize: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F1EA' },
  errorText: { color: '#B71C1C', textAlign: 'center', padding: 24 },
});
