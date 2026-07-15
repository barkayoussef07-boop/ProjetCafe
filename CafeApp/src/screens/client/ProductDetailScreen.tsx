// src/screens/client/ProductDetailScreen.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../context/CartContext';
import { ClientStackParamList } from '../../types';

type Props = NativeStackScreenProps<ClientStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route, navigation }: Props) {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [quantite, setQuantite] = useState(1);

  const handleAdd = () => {
    addToCart(product, quantite);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{product.nom}</Text>
        <Text style={styles.headerCategory}>{product.categorie.nom}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.description}>{product.description || 'Pas de description.'}</Text>

        <Text style={styles.label}>Prix</Text>
        <Text style={styles.price}>{product.prix.toFixed(2)} DT</Text>

        {!product.disponible && (
          <Text style={styles.unavailable}>Ce produit est actuellement epuise.</Text>
        )}

        {product.disponible && (
          <>
            <Text style={styles.label}>Quantite</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantite((q) => Math.max(1, q - 1))}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantite}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantite((q) => q + 1)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>
                Ajouter au panier — {(product.prix * quantite).toFixed(2)} DT
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1EA' },
  header: { backgroundColor: '#0D1B2A', padding: 28, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  headerCategory: { fontSize: 13, color: '#93C5FD', marginTop: 4 },
  content: { padding: 24 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginTop: 16, marginBottom: 6 },
  description: { fontSize: 15, color: '#1C2B38', lineHeight: 22 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#C97B3D' },
  unavailable: { color: '#B71C1C', marginTop: 20, fontWeight: '600' },
  quantityRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', elevation: 1,
  },
  qtyBtnText: { fontSize: 20, fontWeight: 'bold', color: '#0D1B2A' },
  qtyValue: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20, color: '#0D1B2A' },
  addBtn: { backgroundColor: '#C97B3D', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 32 },
  addBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
});
