import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { SuiviText } from './SuiviText';
import { tokens } from '../../theme';

export interface StatCardProps {
  title: string;
  value: string | number;
  color?: 'primary' | 'accent' | 'success' | 'error';
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * StatCard
 * 
 * Carte de statistique pour Quick Actions sur HomeScreen.
 * 
 * Design :
 * - Gradient violet Suivi (primary → primaryDark) ou couleur personnalisée
 * - Texte inverse (blanc) pour valeur et titre
 * - Radius : radius.xl (20px)
 * - Shadow : shadow.card
 * - Padding : spacing.lg (16px)
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi.
 * Gradient via expo-linear-gradient pour effet visuel.
 */
export function StatCard({
  title,
  value,
  color = 'primary',
  onPress,
  style,
}: StatCardProps) {
  // Couleur de fond selon la couleur choisie
  const getBackgroundColor = (): string => {
    switch (color) {
      case 'primary':
        return tokens.colors.brand.primary; // #4F5DFF
      case 'accent':
        return tokens.colors.accent.maize; // #FDD447
      case 'success':
        return tokens.colors.semantic.success; // #00C853
      case 'error':
        return tokens.colors.semantic.error; // #D32F2F
      default:
        return tokens.colors.brand.primary; // #4F5DFF
    }
  };

  const backgroundColor = getBackgroundColor();

  const containerStyle = [
    styles.container,
    {
      backgroundColor,
      borderRadius: tokens.radius.xl, // 20px
      padding: tokens.spacing.lg, // 16px
      ...tokens.shadows.card,
    },
    style,
  ];

  const content = (
    <View style={styles.content}>
      <SuiviText variant="h2" color="inverse" style={styles.value}>
        {value}
      </SuiviText>
      <SuiviText variant="body" color="inverse" style={styles.title}>
        {title}
      </SuiviText>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    marginBottom: tokens.spacing.xs,
    opacity: 1,
    fontSize: 30, // Taille augmentée pour les chiffres
    fontWeight: 'bold', // Texte en gras
  },
  title: {
    opacity: 0.9,
    textAlign: 'center',
  },
});

