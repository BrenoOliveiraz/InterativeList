import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Corrigido o import dos ícones
import MyListsScreen from './myListsScreen';
import SharedListsScreen from './sharedListScreen';
import Perfil from './perfil';

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
            <Ionicons name="list" color={color} size={size} /> // Ícone correto
          ),
          tabBarLabel: 'Minhas Listas',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="SharedListsScreen"
        component={SharedListsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="share-social" color={color} size={size} />
          ),
          tabBarLabel: 'Listas Compartilhadas',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} /> // Ícone de perfil correto
          ),
          tabBarLabel: 'Perfil', // Corrigido o texto da aba
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
