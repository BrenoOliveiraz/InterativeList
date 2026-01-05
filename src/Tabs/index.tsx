import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import MyListsScreen from './MyListsScreen';
import SharedListsScreen from './sharedListScreen';
import ProfileScreen from './perfil';




const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#42f44b', 
        tabBarInactiveTintColor: 'gray', 
        tabBarStyle: {
          backgroundColor: '#333', 
          paddingBottom: 5, 
        },
      }}
    >
      <Tab.Screen
        name="MyListsScreen"
        component={MyListsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} /> 
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
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} /> 
          ),
          tabBarLabel: 'Perfil', 
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
