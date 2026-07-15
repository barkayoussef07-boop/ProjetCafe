// src/screens/client/CategoryListScreen.tsx
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchCategories } from '../../api/categoriesApi';
import { extractErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Category, ClientStackParamList } from '../../types';

// Cet ecran est heberge dans l'onglet "Menu" (tab), mais navigue vers des ecrans
// enregistres au niveau du Stack parent (ProductList) : on type la navigation
// sur ClientStackParamList via le hook plutot que via les props injectees par le Tab.
export function CategoryListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ClientStackParamList>>();
  const { logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
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
      const data = await fetchCategories();
      setCategories(data);
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
        <TouchableOpacity style={styles.retryBtn} onPress={load}>
          <Text style={styles.retryText}>Reessayer</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Le Menu</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Deconnexion</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductList', { categoryId: item.id, categoryNom: item.nom })}
          >
            <Text style={styles.cardTitle}>{item.nom}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucune categorie disponible pour le moment.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1EA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0D1B2A' },
  logout: { color: '#B71C1C', fontWeight: '600', fontSize: 13 },
  list: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#0D1B2A' },
  chevron: { fontSize: 22, color: '#C97B3D' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F5F1EA' },
  errorText: { color: '#B71C1C', textAlign: 'center', marginBottom: 16 },
  retryBtn: { backgroundColor: '#C97B3D', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#FFFFFF', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#64748B', marginTop: 40 },
});
