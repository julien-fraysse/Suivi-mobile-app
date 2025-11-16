import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback } from 'react';

import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { MD3Theme } from 'react-native-paper';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from '@expo-google-fonts/ibm-plex-mono';

import { AuthProvider } from './auth';
import { ThemeProvider, useThemeMode } from './theme/ThemeProvider';
import { tokens } from './theme';

// Navigation root
import RootNavigator from './navigation/RootNavigator';

// Prevent splash screen from auto-hiding before fonts are loaded
// Safe check: only call if SplashScreen is available
if (SplashScreen && typeof SplashScreen.preventAutoHideAsync === 'function') {
  SplashScreen.preventAutoHideAsync().catch(() => {
    // Ignore errors if splash screen is not available (e.g., in web)
  });
}

const queryClient = new QueryClient();

/**
 * createNavigationTheme
 * 
 * Convertit un thème Paper (MD3) en thème React Navigation.
 * IMPORTANT: Inclut la propriété `fonts` pour que useHeaderConfigProps puisse accéder à fonts.regular, fonts.medium, fonts.heavy.
 */
function createNavigationTheme(paperTheme: MD3Theme): NavigationTheme {
  return {
    ...NavigationDefaultTheme,
    dark: paperTheme.dark,
    colors: {
      ...NavigationDefaultTheme.colors,
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.surface,
      text: paperTheme.colors.onSurface,
      border: paperTheme.colors.outline || NavigationDefaultTheme.colors.border,
      notification: paperTheme.colors.primary,
    },
    // CRITICAL: Forward fonts from Paper theme so useHeaderConfigProps can access fonts.regular, fonts.medium, fonts.heavy
    fonts: paperTheme.fonts as any,
  };
}

/**
 * AppContent
 * 
 * Contenu de l'app avec accès au thème pour la StatusBar.
 */
function AppContent() {
  const { isDark, currentTheme } = useThemeMode();
  
  // Convertir le thème Paper en thème Navigation (inclut fonts)
  const navigationTheme = createNavigationTheme(currentTheme);

  return (
    <>
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

/**
 * App
 * 
 * Point d'entrée principal de l'application.
 * 
 * Structure des providers :
 * 1. Font loading : Charge les polices Inter et IBM Plex Mono avant le rendu
 * 2. QueryClientProvider : Gestion des requêtes et cache React Query
 * 3. ThemeProvider : Gestion du thème (light/dark/auto) et PaperProvider
 * 4. AuthProvider : Gestion de l'authentification et de la session
 * 5. NavigationContainer + RootNavigator : Navigation de l'application
 */
export default function App() {
  // Chargement des polices Inter et IBM Plex Mono
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  // Callback to hide splash screen when fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      // Safe check: only hide if SplashScreen is available and hideAsync exists
      if (SplashScreen && typeof SplashScreen.hideAsync === 'function') {
        await SplashScreen.hideAsync().catch(() => {
          // Ignore errors if splash screen is not available (e.g., in web)
        });
      }
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  // Afficher un écran de chargement tant que les polices ne sont pas chargées
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider initialMode="auto">
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
