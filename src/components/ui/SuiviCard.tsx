import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '../../theme';

export interface SuiviCardProps {
  children: React.ReactNode;
  padding?: keyof typeof tokens.spacing;
  elevation?: 'none' | 'sm' | 'card' | 'lg';
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'outlined';
}

/**
 * SuiviCard
 * 
 * Composant Card du UI Kit Suivi, réutilisable pour les Tasks, sections Home, etc.
 * - Fond neutral.background (#F4F2EE) par défaut
 * - Shadow card pour l'élévation légère
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
  const getShadowStyle = () => {
    if (variant === 'outlined') {
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
        borderColor: tokens.colors.neutral.light, // #E8E8E8
      };
    }
    return {};
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: '#FFFFFF', // Fond blanc pour cards
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
