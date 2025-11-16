import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviCardProps {
  children: React.ReactNode;
  padding?: keyof typeof tokens.spacing;
  elevation?: 'none' | 'sm' | 'card' | 'lg';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'outlined';
}

/**
 * SuiviCard
 * 
 * Composant Card du UI Kit Suivi, réutilisable pour les Tasks, sections Home, etc.
 * - Fond adapté selon le thème (light: blanc, dark: surfaceElevated)
 * - Shadow card pour l'élévation légère (light mode uniquement)
 * - Radius 16 par défaut
 * - Padding via tokens spacing
 * 
 * Variantes : default (avec shadow) ou outlined (avec border).
 * Utilise EXCLUSIVEMENT les tokens Suivi pour les couleurs.
 */
export function SuiviCard({
  children,
  padding = 'md',
  elevation: elevationLevel = 'card',
  style,
  onPress,
  variant = 'default',
}: SuiviCardProps) {
  const theme = useTheme();
  const isDark = theme.dark;

  const getShadowStyle = () => {
    // En dark mode, on n'utilise pas de shadow (matte black style)
    if (variant === 'outlined' || isDark) {
      return {};
    }
    // Map elevation keys to shadow keys
    const shadowMap: Record<string, keyof typeof tokens.shadows> = {
      none: 'none',
      sm: 'sm',
      card: 'card',
      lg: 'lg',
    };
    const shadowKey = shadowMap[elevationLevel] || 'card';
    return tokens.shadows[shadowKey];
  };

  const getBorderStyle = () => {
    if (variant === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: isDark 
          ? tokens.colors.border.darkMode.default // rgba(255,255,255,0.08) en dark mode
          : tokens.colors.neutral.light, // #E8E8E8 en light mode
      };
    }
    return {};
  };

  // Background color adapté selon le thème
  const backgroundColor = isDark
    ? tokens.colors.surface.darkElevated // #242424 en dark mode (surfaceElevated)
    : '#FFFFFF'; // Blanc en light mode

  const cardStyle = [
    styles.card,
    {
      backgroundColor,
      padding: tokens.spacing[padding],
      borderRadius: tokens.radius.lg, // 16px par défaut
      ...getShadowStyle(),
      ...getBorderStyle(),
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
