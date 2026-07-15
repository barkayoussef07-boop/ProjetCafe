// src/screens/client/ProductListScreen.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { extractErrorMessage } from '../../api/client';
import { fetchProducts } from '../../api/productsApi';
import { useCart } from '../../context/CartContext';
import { ClientStackParamList, Product } from '../../types';

type Props = NativeStackScreenProps<ClientStackParamList, 'ProductList'>;

export function ProductListScreen({ route, navigation }: Props) {
  const { categoryId, categoryNom } = route.params;
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: categoryNom });
    load();
  }, [categoryId]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts(categoryId);
      setProducts(data);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C97B3D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={products}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>Aucun produit dans cette categorie.</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.nom}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
            <Text style={styles.cardPrice}>{item.prix.toFixed(2)} DT</Text>
            {!item.disponible && <Text style={styles.badge}>Epuise</Text>}
          </View>
          <TouchableOpacity
            style={[styles.addBtn, !item.disponible && styles.addBtnDisabled]}
            disabled={!item.disponible}
            onPress={() => addToCart(item, 1)}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1EA' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  cardInfo: { flex: 1, marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#0D1B2A' },
  cardDesc: { fontSize: 13, color: '#64748B', marginTop: 4 },
  cardPrice: { fontSize: 15, fontWeight: 'bold', color: '#C97B3D', marginTop: 6 },
  badge: { color: '#B71C1C', fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  addBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#C97B3D',
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnDisabled: { backgroundColor: '#CBD5E1' },
  addBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', lineHeight: 22 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F5F1EA' },
  errorText: { color: '#B71C1C', textAlign: 'center' },
  empty: { textAlign: 'center', color: '#64748B', marginTop: 40 },
});
