import React from 'react';
import { ImageBackground, StyleSheet, ViewStyle } from 'react-native';
import { useThemeMode } from '../theme/ThemeProvider';

/**
 * AuthBackground
 * 
 * Composant réutilisable pour afficher un fond d'image sur les écrans d'authentification.
 * 
 * Les fichiers PNG doivent être placés dans :
 * - assets/backgrounds/background-auth-light.png (pour le thème clair)
 * - assets/backgrounds/background-auth-dark.png (pour le thème sombre)
 * 
 * Le composant utilise le même mécanisme de thème que le reste de l'application (useThemeMode)
 * et affiche le background correspondant au thème actuel (light/dark/auto).
 */
export interface AuthBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

// Import statique des deux images
const backgroundLight = require('../assets/backgrounds/background-auth-light.png');
const backgroundDark = require('../assets/backgrounds/background-auth-dark.png');

export function AuthBackground({
  children,
  style,
}: AuthBackgroundProps) {
  // Récupère le thème de l'application (utilise le même système que le reste de l'app)
  const { isDark } = useThemeMode();
  
  // Choisit l'image selon le thème de l'application
  const source = isDark ? backgroundDark : backgroundLight;

  return (
    <ImageBackground
      source={source}
      style={[styles.container, style]}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

