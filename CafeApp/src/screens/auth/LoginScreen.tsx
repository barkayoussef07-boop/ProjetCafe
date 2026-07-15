// src/screens/auth/LoginScreen.tsx
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !motDePasse) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await login(email, motDePasse);
      // La navigation racine bascule automatiquement vers l'espace du role connecte
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
      <Text style={styles.logo}>☕ CafeApp</Text>
      <Text style={styles.subtitle}>Connectez-vous pour commander</Text>

      <View style={styles.promoBanner}>
        <Text style={styles.promoTitle}>🎉 Offres reservees a l'application</Text>
        <Text style={styles.promoLine}>-10% sur votre première commande</Text>
        <Text style={styles.promoLine}>-15% des 10 produits commandes</Text>
      </View>

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
        placeholder="Mot de passe"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        value={motDePasse}
        onChangeText={setMotDePasse}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Se connecter</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Pas encore de compte ? Creer un compte client</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A', justifyContent: 'center', padding: 24 },
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
