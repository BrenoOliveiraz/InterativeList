// App.tsx
import React from 'react';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Routes from './src/Routes';
import { AuthProvider } from './src/Contexts/AuthContext';

export default function App() {
  return (
    <NativeBaseProvider>
      <AuthProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar barStyle='light-content' translucent backgroundColor='transparent' />
          <Routes />
        </GestureHandlerRootView>
      </AuthProvider>
    </NativeBaseProvider>
  );
}
