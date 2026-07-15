// src/navigation/GerantNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';
import { CategoryManagementScreen } from '../screens/gerant/CategoryManagementScreen';
import { DashboardScreen } from '../screens/gerant/DashboardScreen';
import { ProductManagementScreen } from '../screens/gerant/ProductManagementScreen';
import { UserManagementScreen } from '../screens/gerant/UserManagementScreen';
import { GerantTabParamList } from '../types';

const Tab = createBottomTabNavigator<GerantTabParamList>();

const TAB_ICONS: Record<keyof GerantTabParamList, string> = {
  Dashboard: '📊',
  Categories: '🗂️',
  Produits: '📦',
  Utilisateurs: '👥',
};

export function GerantNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#C97B3D',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{TAB_ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Categories" component={CategoryManagementScreen} />
      <Tab.Screen name="Produits" component={ProductManagementScreen} />
      <Tab.Screen name="Utilisateurs" component={UserManagementScreen} />
    </Tab.Navigator>
  );
}
