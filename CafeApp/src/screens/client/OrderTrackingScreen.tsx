// src/screens/client/OrderTrackingScreen.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { extractErrorMessage } from '../../api/client';
import { fetchOrderById } from '../../api/ordersApi';
import { ClientStackParamList, Order, OrderStatus } from '../../types';

type Props = NativeStackScreenProps<ClientStackParamList, 'OrderTracking'>;

const STEPS: OrderStatus[] = ['EN_ATTENTE', 'EN_PREPARATION', 'PRETE', 'LIVREE'];

const STEP_LABELS: Record<OrderStatus, string> = {
  EN_ATTENTE: 'En attente',
  EN_PREPARATION: 'En preparation',
  PRETE: 'Prete',
  LIVREE: 'Livree',
  ANNULEE: 'Annulee',
};

// Suivi en temps reel par polling : on rafraichit toutes les 5 secondes tant
// que la commande n'est pas terminee (LIVREE ou ANNULEE).
const POLL_INTERVAL_MS = 5000;

export function OrderTrackingScreen({ route }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval>;

    const load = async () => {
      try {
        const data = await fetchOrderById(orderId);
        if (!cancelled) {
          setOrder(data);
          if (data.statut === 'LIVREE' || data.statut === 'ANNULEE') {
            clearInterval(interval);
          }
        }
      } catch (err) {
        if (!cancelled) setError(extractErrorMessage(err));
      }
    };

    load();
    interval = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [orderId]);

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

  const currentStepIndex = STEPS.indexOf(order.statut);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Commande #{order.id}</Text>

      {order.pourcentageRemise > 0 ? (
        <View style={styles.recap}>
          <View style={styles.recapRow}>
            <Text style={styles.recapLabel}>Sous-total</Text>
            <Text style={styles.recapStrike}>{order.sousTotal.toFixed(2)} DT</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapDiscountLabel}>🎉 Remise -{order.pourcentageRemise}%</Text>
            <Text style={styles.recapDiscountValue}>
              -{(order.sousTotal - order.total).toFixed(2)} DT
            </Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapTotalLabel}>Total payé</Text>
            <Text style={styles.recapTotalValue}>{order.total.toFixed(2)} DT</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.subtitle}>Total : {order.total.toFixed(2)} DT</Text>
      )}

      {order.statut === 'ANNULEE' ? (
        <Text style={styles.cancelled}>Cette commande a ete annulee.</Text>
      ) : (
        <View style={styles.stepsContainer}>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <View style={[styles.dot, index <= currentStepIndex && styles.dotActive]} />
              <Text style={[styles.stepLabel, index <= currentStepIndex && styles.stepLabelActive]}>
                {STEP_LABELS[step]}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.label}>Paiement</Text>
      <Text style={styles.value}>
        {order.modePaiement === 'EN_LIGNE' ? 'En ligne' : 'Au comptoir'} — {order.statutPaiement === 'PAYE' ? 'Paye' : 'En attente'}
      </Text>

      <Text style={styles.label}>Articles</Text>
      {order.items.map((item) => (
        <Text key={item.id} style={styles.itemLine}>
          {item.quantite} x {item.nomProduit} — {item.sousTotal.toFixed(2)} DT
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1EA', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0D1B2A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 24 },
  recap: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginTop: 12, marginBottom: 24,
  },
  recapRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  recapLabel: { fontSize: 13, color: '#64748B' },
  recapStrike: { fontSize: 13, color: '#94A3B8', textDecorationLine: 'line-through' },
  recapDiscountLabel: { fontSize: 13, color: '#C97B3D', fontWeight: '700' },
  recapDiscountValue: { fontSize: 13, color: '#C97B3D', fontWeight: '700' },
  recapTotalLabel: { fontSize: 15, color: '#0D1B2A', fontWeight: 'bold', marginTop: 4 },
  recapTotalValue: { fontSize: 17, color: '#0D1B2A', fontWeight: 'bold', marginTop: 4 },
  stepsContainer: { marginBottom: 24 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#CBD5E1', marginRight: 12 },
  dotActive: { backgroundColor: '#C97B3D' },
  stepLabel: { fontSize: 15, color: '#94A3B8' },
  stepLabelActive: { color: '#0D1B2A', fontWeight: '600' },
  cancelled: { color: '#B71C1C', fontWeight: 'bold', fontSize: 15, marginBottom: 24 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginTop: 12, marginBottom: 6 },
  value: { fontSize: 14, color: '#0D1B2A' },
  itemLine: { fontSize: 14, color: '#0D1B2A', marginBottom: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F1EA' },
  errorText: { color: '#B71C1C', textAlign: 'center', padding: 24 },
});
