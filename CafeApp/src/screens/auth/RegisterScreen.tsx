// src/screens/auth/RegisterScreen.tsx
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { extractErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { AuthStackParamList } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!nom || !email || !motDePasse) {
      setError('Veuillez remplir les champs obligatoires');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await register(nom, email, motDePasse, telephone || undefined);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>☕ CafeApp</Text>
        <Text style={styles.subtitle}>Creer un compte client</Text>

        <View style={styles.promoBanner}>
          <Text style={styles.promoTitle}>🎉 Rien qu'en creant un compte</Text>
          <Text style={styles.promoLine}>-10% sur votre première commande</Text>
          <Text style={styles.promoLine}>-15% des 10 produits commandes</Text>
        </View>

        <TextInput style={styles.input} placeholder="Nom complet" placeholderTextColor="#94A3B8" value={nom} onChangeText={setNom} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Telephone (optionnel)"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
          value={telephone}
          onChangeText={setTelephone}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe (6 caracteres min)"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={motDePasse}
          onChangeText={setMotDePasse}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Creer mon compte</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Deja un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginBottom: 20 },
  promoBanner: {
    backgroundColor: 'rgba(201,123,61,0.12)',
    borderWidth: 1,
    borderColor: '#C97B3D',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  promoTitle: { color: '#F2C9A0', fontWeight: '700', fontSize: 13, textAlign: 'center', marginBottom: 6 },
  promoLine: { color: '#FFFFFF', fontSize: 13, textAlign: 'center', marginBottom: 2 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#C97B3D',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#93C5FD', textAlign: 'center', marginTop: 20, fontSize: 13 },
  error: { color: '#FCA5A5', textAlign: 'center', marginBottom: 12, fontSize: 13 },
});
