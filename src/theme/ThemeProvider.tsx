import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider, MD3Theme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { suiviLightTheme, suiviDarkTheme } from '../../theme/paper-theme';

/**
 * Theme Mode
 * 
 * Mode du thème : 'light', 'dark', ou 'auto' (suit le mode système).
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Theme Context Value
 * 
 * Contexte exposant le mode de thème actuel et la fonction pour le changer.
 */
export type ThemeContextValue = {
  themeMode: ThemeMode;
  currentTheme: MD3Theme;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * useThemeMode
 * 
 * Hook pour accéder au contexte de thème et changer le mode.
 * 
 * @returns {ThemeContextValue} Le contexte de thème avec themeMode, currentTheme, setThemeMode, isDark
 */
export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
}

export interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

/**
 * ThemeProvider
 * 
 * Provider central pour gérer le thème de l'application.
 * 
 * - Encapsule `PaperProvider` de React Native Paper
 * - Gère le mode light/dark/auto (suit le mode système)
 * - Injecte les tokens Suivi dans le thème Paper
 * - Expose un contexte pour changer le mode de thème
 * 
 * @param {ReactNode} children - Les enfants à envelopper
 * @param {ThemeMode} initialMode - Mode initial ('light', 'dark', ou 'auto') - Par défaut: 'auto'
 */
export function ThemeProvider({
  children,
  initialMode = 'auto',
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialMode);

  // Détermine le thème effectif en fonction du mode
  const getEffectiveTheme = (): MD3Theme => {
    if (themeMode === 'auto') {
      // Suit le mode système
      return systemColorScheme === 'dark' ? suiviDarkTheme : suiviLightTheme;
    }
    // Mode forcé (light ou dark)
    return themeMode === 'dark' ? suiviDarkTheme : suiviLightTheme;
  };

  const currentTheme = getEffectiveTheme();
  const isDark = currentTheme === suiviDarkTheme;

  const value: ThemeContextValue = {
    themeMode,
    currentTheme,
    setThemeMode,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={currentTheme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
}

