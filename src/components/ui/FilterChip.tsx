import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { tokens } from '../../theme';

export interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * FilterChip
 * 
 * Chip réutilisable pour les filtres (ex: All, Open, Late, Done).
 * - brand.primary utilisé pour les chips sélectionnées
 * - Radius 16 par défaut
 * - Typography Inter Medium pour le texte
 * 
 * États : selected | default.
 * Utilise EXCLUSIVEMENT les tokens Suivi pour les styles.
 */
export function FilterChip({
  label,
  selected = false,
  onPress,
  disabled = false,
  style,
  textStyle,
}: FilterChipProps) {
  const getBackgroundColor = () => {
    if (disabled) {
      return tokens.colors.neutral.light; // #E8E8E8
    }
    return selected ? tokens.colors.brand.primary : '#FFFFFF'; // #4F5DFF ou blanc
  };

  const getTextColor = () => {
    if (disabled) {
      return tokens.colors.neutral.medium; // #98928C
    }
    return selected ? '#FFFFFF' : tokens.colors.neutral.dark; // Blanc ou #4F4A45
  };

  const getBorderColor = () => {
    if (disabled) {
      return tokens.colors.neutral.light; // #E8E8E8
    }
    return selected ? tokens.colors.brand.primary : tokens.colors.neutral.light; // #4F5DFF ou #E8E8E8
  };

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.chipText,
          {
            color: getTextColor(),
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.lg, // 16px par défaut
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  chipText: {
    fontFamily: tokens.typography.label.fontFamily, // Inter_500Medium
    fontSize: tokens.typography.label.fontSize, // 13
    lineHeight: tokens.typography.label.fontSize * 1.3, // Approx line height
  },
});
