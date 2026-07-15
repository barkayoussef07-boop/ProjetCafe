// src/screens/gerant/UserManagementScreen.tsx
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
import { extractErrorMessage } from '../../api/client';
import { createUser, deleteUser, fetchUsers } from '../../api/usersApi';
import { Role, User } from '../../types';

const emptyForm = { nom: '', email: '', motDePasse: '', role: 'COMPTOIRISTE' as Role };

export function UserManagementScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
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
      setUsers(await fetchUsers());
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.nom.trim() || !form.email.trim() || form.motDePasse.length < 6) {
      Alert.alert('Formulaire incomplet', 'Nom, email et mot de passe (6 caracteres min) sont obligatoires.');
      return;
    }
    try {
      setSaving(true);
      await createUser(form);
      setForm(emptyForm);
      await load();
    } catch (err) {
      Alert.alert('Erreur', extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (user: User) => {
    Alert.alert('Supprimer', `Supprimer le compte de "${user.nom}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(user.id);
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
      <Text style={styles.title}>Comptes utilisateurs</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          placeholderTextColor="#94A3B8"
          value={form.nom}
          onChangeText={(v) => setForm((f) => ({ ...f, nom: v }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe (6 caracteres min)"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={form.motDePasse}
          onChangeText={(v) => setForm((f) => ({ ...f, motDePasse: v }))}
        />

        <View style={styles.roleRow}>
          {(['COMPTOIRISTE', 'GERANT'] as Role[]).map((role) => (
            <TouchableOpacity
              key={role}
              style={[styles.roleChip, form.role === role && styles.roleChipActive]}
              onPress={() => setForm((f) => ({ ...f, role }))}
            >
              <Text style={[styles.roleChipText, form.role === role && styles.roleChipTextActive]}>
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleCreate} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveBtnText}>Creer le compte</Text>}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        contentContainerStyle={styles.list}
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.nom}</Text>
              <Text style={styles.rowSubtitle}>{item.email} — {item.role}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item)}>
              <Text style={styles.deleteText}>Supprimer</Text>
            </TouchableOpacity>
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
  roleRow: { flexDirection: 'row', marginBottom: 12 },
  roleChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF',
    marginRight: 8, borderWidth: 1, borderColor: '#CBD5E1',
  },
  roleChipActive: { backgroundColor: '#0D1B2A', borderColor: '#0D1B2A' },
  roleChipText: { color: '#0D1B2A', fontSize: 13 },
  roleChipTextActive: { color: '#FFFFFF' },
  saveBtn: { backgroundColor: '#0D1B2A', borderRadius: 10, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  list: { padding: 16, paddingTop: 8 },
  row: {
    backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  rowTitle: { fontSize: 14, fontWeight: '600', color: '#0D1B2A' },
  rowSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  deleteText: { color: '#B71C1C', fontSize: 13 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F1EA' },
  errorText: { color: '#B71C1C', textAlign: 'center', marginBottom: 12 },
});
