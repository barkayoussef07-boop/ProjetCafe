// src/screens/comptoiriste/ProductAvailabilityScreen.tsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { extractErrorMessage } from '../../api/client';
import { fetchProducts, updateProductAvailability } from '../../api/productsApi';
import { Product } from '../../types';

export function ProductAvailabilityScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (product: Product) => {
    try {
      setUpdatingId(product.id);
      const updated = await updateProductAvailability(product.id, !product.disponible);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setUpdatingId(null);
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
      <Text style={styles.title}>Disponibilite des produits</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        contentContainerStyle={styles.list}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>{item.nom}</Text>
              <Text style={styles.rowCategory}>{item.categorie.nom}</Text>
            </View>
            {updatingId === item.id ? (
              <ActivityIndicator color="#C97B3D" />
            ) : (
              <Switch
                value={item.disponible}
                onValueChange={() => handleToggle(item)}
                trackColor={{ false: '#CBD5E1', true: '#C97B3D' }}
              />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1EA' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0D1B2A', padding: 20, paddingBottom: 8 },
  list: { padding: 16 },
  row: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#0D1B2A' },
  rowCategory: { fontSize: 12, color: '#64748B', marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F1EA' },
  errorText: { color: '#B71C1C', textAlign: 'center', marginBottom: 12 },
});
