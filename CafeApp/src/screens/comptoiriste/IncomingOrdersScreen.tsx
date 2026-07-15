// src/screens/comptoiriste/IncomingOrdersScreen.tsx
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
import { fetchIncomingOrders } from '../../api/ordersApi';
import { useAuth } from '../../context/AuthContext';
import { ComptoiristeStackParamList, Order } from '../../types';

const STATUS_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  EN_PREPARATION: 'En preparation',
  PRETE: 'Prete',
  LIVREE: 'Livree',
  ANNULEE: 'Annulee',
};

const POLL_INTERVAL_MS = 5000;

export function IncomingOrdersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ComptoiristeStackParamList>>();
  const { logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchIncomingOrders();
      setOrders(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
      const interval = setInterval(load, POLL_INTERVAL_MS);
      return () => clearInterval(interval);
    }, [load])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={['top']}>
        <ActivityIndicator size="large" color="#C97B3D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Commandes entrantes</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Deconnexion</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        contentContainerStyle={styles.list}
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Aucune commande en cours.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OrderDetailStaff', { orderId: item.id })}
          >
            <View>
              <Text style={styles.cardTitle}>Commande #{item.id} — {item.clientNom}</Text>
              <Text style={styles.cardDate}>{new Date(item.dateCommande).toLocaleTimeString()}</Text>
            </View>
            <View style={styles.cardRight}>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0D1B2A' },
  logout: { color: '#B71C1C', fontWeight: '600', fontSize: 13 },
  list: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0D1B2A' },
  cardDate: { fontSize: 12, color: '#64748B', marginTop: 4 },
  cardRight: { alignItems: 'flex-end' },
  cardTotal: { fontSize: 15, fontWeight: 'bold', color: '#C97B3D' },
  cardStatus: { fontSize: 12, color: '#0D1B2A', marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F1EA' },
  errorText: { color: '#B71C1C', textAlign: 'center', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#64748B', marginTop: 40 },
});
