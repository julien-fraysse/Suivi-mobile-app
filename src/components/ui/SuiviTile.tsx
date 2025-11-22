import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '@theme';

export interface SuiviTileProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: keyof typeof tokens.spacing;
}

/**
 * SuiviTile
 * 
 * Tuile violette Suivi pour les shortcuts HomeScreen, KPIs, notifications importantes.
 * 
 * Design :
 * - Fond : colors.brand.primary (#4F5DFF)
 * - Texte/icône : colors.brand.primaryLight (#B8C0FF)
 * - Radius : radius.xl (20px)
 * - Padding : spacing.lg (16px)
 * - Shadow : shadow.card
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi.
 */
export function SuiviTile({
  children,
  onPress,
  style,
  padding = 'lg',
}: SuiviTileProps) {
  const tileStyle = [
    styles.tile,
    {
      backgroundColor: tokens.colors.brand.primary, // #4F5DFF
      padding: tokens.spacing[padding],
      borderRadius: tokens.radius.xl, // 20px
      ...tokens.shadows.card,
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={tileStyle}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={tileStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    overflow: 'hidden',
  },
});


