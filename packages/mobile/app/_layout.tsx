// ============================================================
//  NEXUS Mobile — Root App Layout
//  Bootstraps React Query, Toast provider, and Expo Router.
// ============================================================

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';

// Configure React Query global defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,        // 30 seconds
      gcTime: 1000 * 60 * 5,       // 5 minutes
      retry: 2,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        {/* Dark status bar to match deep-space theme */}
        <StatusBar style="light" backgroundColor={Colors.bgBase} />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.bgBase },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

        {/* Global Toast notifications */}
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
