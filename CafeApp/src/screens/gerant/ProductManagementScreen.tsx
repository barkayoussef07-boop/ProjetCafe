// src/screens/gerant/ProductManagementScreen.tsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchCategories } from '../../api/categoriesApi';
import { extractErrorMessage } from '../../api/client';
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from '../../api/productsApi';
import { Category, Product } from '../../types';

const emptyForm = { nom: '', description: '', prix: '', categorieId: null as number | null };

export function ProductManagementScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSave = async () => {
    const prix = parseFloat(form.prix.replace(',', '.'));
    if (!form.nom.trim() || !form.categorieId || Number.isNaN(prix)) {
      Alert.alert('Formulaire incomplet', 'Nom, prix et categorie sont obligatoires.');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        nom: form.nom.trim(),
        description: form.description.trim(),
        prix,
        categorieId: form.categorieId,
      };
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      Alert.alert('Erreur', extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      nom: product.nom,
      description: product.description || '',
      prix: product.prix.toString(),
      categorieId: product.categorie.id,
    });
  };

  const handleDelete = (product: Product) => {
    Alert.alert('Supprimer', `Supprimer le produit "${product.nom}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(product.id);
            await load();
          } catch (err) {
            Alert.alert('Erreur', extractErrorMessage(err));
          }
        },
      },
    ]);
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
      <Text style={styles.title}>Produits</Text>

      <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 8 }}>
        <TextInput
          style={styles.input}
          placeholder="Nom du produit"
          placeholderTextColor="#94A3B8"
          value={form.nom}
          onChangeText={(v) => setForm((f) => ({ ...f, nom: v }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#94A3B8"
          value={form.description}
          onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Prix (DT)"
          placeholderTextColor="#94A3B8"
          keyboardType="decimal-pad"
          value={form.prix}
          onChangeText={(v) => setForm((f) => ({ ...f, prix: v }))}
        />

        <Text style={styles.label}>Categorie</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, form.categorieId === cat.id && styles.chipActive]}
              onPress={() => setForm((f) => ({ ...f, categorieId: cat.id }))}
            >
              <Text style={[styles.chipText, form.categorieId === cat.id && styles.chipTextActive]}>
                {cat.nom}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : (
            <Text style={styles.saveBtnText}>{editingId ? 'Modifier le produit' : 'Ajouter le produit'}</Text>
          )}
        </TouchableOpacity>
        {editingId && (
          <TouchableOpacity onPress={resetForm}>
            <Text style={styles.cancelLink}>Annuler l'edition</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        contentContainerStyle={styles.list}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.nom}</Text>
              <Text style={styles.rowSubtitle}>{item.categorie.nom} — {item.prix.toFixed(2)} DT</Text>
            </View>
            <View style={styles.rowActions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.editText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Text style={styles.deleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F1EA' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0D1B2A', padding: 20, paddingBottom: 8 },
  form: { paddingHorizontal: 16, maxHeight: 320 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, marginBottom: 10, fontSize: 14 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginBottom: 6 },
  chipsRow: { marginBottom: 12 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF',
    marginRight: 8, borderWidth: 1, borderColor: '#CBD5E1',
  },
  chipActive: { backgroundColor: '#0D1B2A', borderColor: '#0D1B2A' },
  chipText: { color: '#0D1B2A', fontSize: 13 },
  chipTextActive: { color: '#FFFFFF' },
  saveBtn: { backgroundColor: '#0D1B2A', borderRadius: 10, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  cancelLink: { color: '#64748B', textAlign: 'center', marginTop: 8, fontSize: 12, marginBottom: 8 },
  list: { padding: 16, paddingTop: 8 },
  row: {
    backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  rowTitle: { fontSize: 14, fontWeight: '600', color: '#0D1B2A' },
  rowSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  rowActions: { flexDirection: 'row' },
  editText: { color: '#0D1B2A', fontSize: 13, marginRight: 16 },
  deleteText: { color: '#B71C1C', fontSize: 13 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F1EA' },
  errorText: { color: '#B71C1C', textAlign: 'center', marginBottom: 12 },
});
