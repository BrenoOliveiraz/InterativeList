import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons'; // Ícones do Ionicons
import MyListsScreen from './MyListsScreen';
import SharedListsScreen from './sharedListScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#42f44b', // Cor do ícone ativo
        tabBarInactiveTintColor: 'gray', // Cor do ícone inativo
        tabBarStyle: {
          backgroundColor: '#333', // Cor de fundo da tab
          paddingBottom: 5, // Ajuste do padding inferior
        },
      }}
    >
      <Tab.Screen
        name="MyListsScreen"
        component={MyListsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} /> // Ícone da aba
          ),
          tabBarLabel: 'Minhas Listas', // Texto da aba
          headerShown: false, // Remove o header
        }}
      />
      <Tab.Screen
        name="SharedListsScreen"
        component={SharedListsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="share-social" color={color} size={size} /> // Ícone da aba
          ),
          tabBarLabel: 'Listas Compartilhadas', // Texto da aba
          headerShown: false, // Remove o header
        }}
      />
    </Tab.Navigator>
  );
}
