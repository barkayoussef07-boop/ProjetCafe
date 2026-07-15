/**
 * CafeApp — application de commande pour un cafe
 * Un seul projet React Native, l'ecran affiche depend du role du compte connecte
 * (CLIENT / COMPTOIRISTE / GERANT).
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B2A" />
      <AuthProvider>
        <CartProvider>
          <RootNavigator />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
