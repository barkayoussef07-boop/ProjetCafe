// src/navigation/ClientNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { CartScreen } from '../screens/client/CartScreen';
import { CategoryListScreen } from '../screens/client/CategoryListScreen';
import { OrderHistoryScreen } from '../screens/client/OrderHistoryScreen';
import { OrderTrackingScreen } from '../screens/client/OrderTrackingScreen';
import { ProductDetailScreen } from '../screens/client/ProductDetailScreen';
import { ProductListScreen } from '../screens/client/ProductListScreen';
import { ClientStackParamList, ClientTabParamList } from '../types';

const Tab = createBottomTabNavigator<ClientTabParamList>();
const Stack = createNativeStackNavigator<ClientStackParamList>();

const TAB_ICONS: Record<keyof ClientTabParamList, string> = {
  Menu: '☕',
  Panier: '🛒',
  Commandes: '📋',
};

function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#C97B3D',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{TAB_ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Menu" component={CategoryListScreen} />
      <Tab.Screen name="Panier" component={CartScreen} options={{ title: 'Panier' }} />
      <Tab.Screen name="Commandes" component={OrderHistoryScreen} options={{ title: 'Mes commandes' }} />
    </Tab.Navigator>
  );
}

export function ClientNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0D1B2A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="ClientTabs" component={ClientTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Produits' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Detail produit' }} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} options={{ title: 'Suivi de commande' }} />
    </Stack.Navigator>
  );
}
