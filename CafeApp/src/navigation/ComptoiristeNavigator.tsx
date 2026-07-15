// src/navigation/ComptoiristeNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { IncomingOrdersScreen } from '../screens/comptoiriste/IncomingOrdersScreen';
import { OrderDetailStaffScreen } from '../screens/comptoiriste/OrderDetailStaffScreen';
import { ProductAvailabilityScreen } from '../screens/comptoiriste/ProductAvailabilityScreen';
import { ComptoiristeStackParamList, ComptoiristeTabParamList } from '../types';

const Tab = createBottomTabNavigator<ComptoiristeTabParamList>();
const Stack = createNativeStackNavigator<ComptoiristeStackParamList>();

const TAB_ICONS: Record<keyof ComptoiristeTabParamList, string> = {
  Entrantes: '📥',
  Produits: '📦',
};

function ComptoiristeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#C97B3D',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{TAB_ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Entrantes" component={IncomingOrdersScreen} options={{ title: 'Commandes' }} />
      <Tab.Screen name="Produits" component={ProductAvailabilityScreen} options={{ title: 'Stock' }} />
    </Tab.Navigator>
  );
}

export function ComptoiristeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0D1B2A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="ComptoiristeTabs" component={ComptoiristeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="OrderDetailStaff" component={OrderDetailStaffScreen} options={{ title: 'Detail commande' }} />
    </Stack.Navigator>
  );
}
