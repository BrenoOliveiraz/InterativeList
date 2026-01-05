// App.tsx
import React from 'react';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Routes from './src/Routes';
import { AuthProvider } from './src/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minuto
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NativeBaseProvider>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar barStyle='light-content' translucent backgroundColor='transparent' />
            <Routes />
          </GestureHandlerRootView>
        </AuthProvider>
      </NativeBaseProvider>
    </QueryClientProvider>
  );
}
