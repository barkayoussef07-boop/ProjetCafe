// src/navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { ClientNavigator } from './ClientNavigator';
import { ComptoiristeNavigator } from './ComptoiristeNavigator';
import { GerantNavigator } from './GerantNavigator';

// Point d'entree unique de la navigation : la meme application affiche un espace
// different (Client / Comptoiriste / Gerant) selon le role du compte connecte.
export function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D1B2A' }}>
        <ActivityIndicator size="large" color="#C97B3D" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : user.role === 'CLIENT' ? (
        <ClientNavigator />
      ) : user.role === 'COMPTOIRISTE' ? (
        <ComptoiristeNavigator />
      ) : (
        <GerantNavigator />
      )}
    </NavigationContainer>
  );
}
