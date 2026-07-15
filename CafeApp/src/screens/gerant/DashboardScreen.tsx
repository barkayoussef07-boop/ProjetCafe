// src/screens/gerant/DashboardScreen.tsx
import { useFocusEffect } from '@react-navigation/native';
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
import { fetchDailyStats } from '../../api/statsApi';
import { useAuth } from '../../context/AuthContext';
import { DailyStats } from '../../types';

export function DashboardScreen() {
  const { logout } = useAuth();
  const [stats, setStats] = useState<DailyStats | null>(null);
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
      const data = await fetchDailyStats();
      setStats(data);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de bord</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Deconnexion</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {stats && (
        <>
          <View style={styles.cardsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.nombreCommandes}</Text>
              <Text style={styles.statLabel}>Commandes aujourd'hui</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.gainJournalier.toFixed(2)} DT</Text>
              <Text style={styles.statLabel}>Gain journalier</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Produits populaires</Text>
          <FlatList
            data={stats.produitsPopulaires}
            keyExtractor={(item) => item.nom}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>Pas encore de ventes.</Text>}
            renderItem={({ item, index }) => (
              <View style={styles.popularRow}>
                <Text style={styles.popularRank}>{index + 1}</Text>
                <Text style={styles.popularName}>{item.nom}</Text>
                <Text style={styles.popularQty}>{item.quantiteVendue} vendus</Text>
              </View>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1EA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0D1B2A' },
  logout: { color: '#B71C1C', fontWeight: '600', fontSize: 13 },
  cardsRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 18, marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#C97B3D' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 6, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0D1B2A', paddingHorizontal: 20, marginTop: 20, marginBottom: 8 },
  list: { paddingHorizontal: 16 },
  popularRow: {
    backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center',
  },
  popularRank: { fontSize: 14, fontWeight: 'bold', color: '#C97B3D', width: 24 },
  popularName: { flex: 1, fontSize: 14, color: '#0D1B2A' },
  popularQty: { fontSize: 13, color: '#64748B' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F1EA' },
  errorText: { color: '#B71C1C', textAlign: 'center', paddingHorizontal: 20, marginBottom: 12 },
  empty: { textAlign: 'center', color: '#64748B', marginTop: 20 },
});
