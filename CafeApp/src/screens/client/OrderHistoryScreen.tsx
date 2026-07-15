// src/screens/client/OrderHistoryScreen.tsx
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
import { fetchMyOrders } from '../../api/ordersApi';
import { ClientStackParamList, Order } from '../../types';

const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  EN_PREPARATION: 'En preparation',
  PRETE: 'Prete',
  LIVREE: 'Livree',
  ANNULEE: 'Annulee',
};

export function OrderHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ClientStackParamList>>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMyOrders();
      setOrders(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <ActivityIndicator size="large" color="#C97B3D" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        contentContainerStyle={styles.list}
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Vous n'avez pas encore passe de commande.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}>
            <View>
              <Text style={styles.cardTitle}>Commande #{item.id}</Text>
              <Text style={styles.cardDate}>{new Date(item.dateCommande).toLocaleString()}</Text>
            </View>
            <View style={styles.cardRight}>
              {item.pourcentageRemise > 0 && (
                <Text style={styles.cardBadge}>-{item.pourcentageRemise}%</Text>
              )}
              <Text style={styles.cardTotal}>{item.total.toFixed(2)} DT</Text>
              <Text style={styles.cardStatus}>{STATUS_LABELS[item.statut]}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1EA' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0D1B2A' },
  cardDate: { fontSize: 12, color: '#64748B', marginTop: 4 },
  cardRight: { alignItems: 'flex-end' },
  cardBadge: {
    fontSize: 11, fontWeight: 'bold', color: '#FFFFFF', backgroundColor: '#C97B3D',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginBottom: 4, overflow: 'hidden',
  },
  cardTotal: { fontSize: 15, fontWeight: 'bold', color: '#C97B3D' },
  cardStatus: { fontSize: 12, color: '#0D1B2A', marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F1EA' },
  errorText: { color: '#B71C1C', textAlign: 'center', padding: 24 },
  empty: { textAlign: 'center', color: '#64748B', marginTop: 40 },
});
