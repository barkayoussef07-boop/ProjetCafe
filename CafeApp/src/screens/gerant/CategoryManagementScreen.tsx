// src/screens/gerant/CategoryManagementScreen.tsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../../api/categoriesApi';
import { extractErrorMessage } from '../../api/client';
import { Category } from '../../types';

export function CategoryManagementScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nom, setNom] = useState('');
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
      setCategories(await fetchCategories());
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNom('');
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!nom.trim()) return;
    try {
      setSaving(true);
      if (editingId) {
        await updateCategory(editingId, nom.trim());
      } else {
        await createCategory(nom.trim());
      }
      resetForm();
      await load();
    } catch (err) {
      Alert.alert('Erreur', extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setNom(category.nom);
  };

  const handleDelete = (category: Category) => {
    Alert.alert('Supprimer', `Supprimer la categorie "${category.nom}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(category.id);
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
      <Text style={styles.title}>Categories</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nom de la categorie"
          placeholderTextColor="#94A3B8"
          value={nom}
          onChangeText={setNom}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : (
            <Text style={styles.saveBtnText}>{editingId ? 'Modifier' : 'Ajouter'}</Text>
          )}
        </TouchableOpacity>
        {editingId && (
          <TouchableOpacity onPress={resetForm}>
            <Text style={styles.cancelLink}>Annuler l'edition</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        contentContainerStyle={styles.list}
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item.nom}</Text>
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
  form: { paddingHorizontal: 16, marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, marginBottom: 10, fontSize: 14 },
  saveBtn: { backgroundColor: '#0D1B2A', borderRadius: 10, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  cancelLink: { color: '#64748B', textAlign: 'center', marginTop: 8, fontSize: 12 },
  list: { padding: 16, paddingTop: 8 },
  row: {
    backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  rowTitle: { fontSize: 14, fontWeight: '600', color: '#0D1B2A' },
  rowActions: { flexDirection: 'row', gap: 16 },
  editText: { color: '#0D1B2A', fontSize: 13, marginRight: 16 },
  deleteText: { color: '#B71C1C', fontSize: 13 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F1EA' },
  errorText: { color: '#B71C1C', textAlign: 'center', marginBottom: 12 },
});
