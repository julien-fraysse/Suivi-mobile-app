import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback } from 'react';

import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import type { MD3Theme } from 'react-native-paper';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';

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
import { TasksProvider } from './tasks/TasksContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider, useThemeMode } from './theme/ThemeProvider';
import { NotificationsProvider } from './features/notifications/notificationsStore';
import { SuiviQueryProvider } from './services/QueryProvider';
import { useAuthStore } from '@store/authStore';
import { AppLoadingScreen } from '@screens/AppLoadingScreen';
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
 * Gère l'affichage conditionnel selon l'état d'authentification.
 */
function AppContent() {
  const { isDark, currentTheme } = useThemeMode();
  const isLoading = useAuthStore((s) => s.isLoading);
  
  // Convertir le thème Paper en thème Navigation (inclut fonts)
  const navigationTheme = createNavigationTheme(currentTheme);

  // Afficher l'écran de chargement si l'authentification est en cours
  if (isLoading) {
    return <AppLoadingScreen />;
  }

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
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SuiviQueryProvider>
            <SettingsProvider>
              <ThemeProvider initialMode="auto">
                <AuthProvider>
                  <TasksProvider>
                    <NotificationsProvider>
                      <AppContent />
                    </NotificationsProvider>
                  </TasksProvider>
                </AuthProvider>
              </ThemeProvider>
            </SettingsProvider>
          </SuiviQueryProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}
