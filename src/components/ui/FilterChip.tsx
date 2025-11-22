import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { tokens } from '@theme';

export interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  /** Material 3 style (for HomeScreen activities) */
  material3?: boolean;
}

/**
 * FilterChip
 * 
 * Chip réutilisable pour les filtres (ex: All, Open, Late, Done).
 * - Material 3 style optionnel pour les activités récentes avec support light/dark mode
 * - brand.primary utilisé pour les chips sélectionnées
 * - Radius 16 par défaut (20 pour Material 3)
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
  material3 = false,
}: FilterChipProps) {
  const theme = useTheme();
  const isDark = theme.dark;

  // Material 3 style (pour HomeScreen) avec support light/dark mode
  if (material3) {
    const getBackgroundColor = () => {
      if (disabled) {
        return isDark ? '#1C1C1E' : '#E5E5E7';
      }
      return selected ? '#4D5BFF' : (isDark ? '#1C1C1E' : '#E5E5E7');
    };

    const getTextColor = () => {
      if (disabled) {
        return isDark ? 'rgba(255,255,255,0.40)' : 'rgba(58,58,60,0.40)';
      }
      return selected ? '#FFFFFF' : (isDark ? 'rgba(255,255,255,0.70)' : '#3A3A3C');
    };

    const getBorderColor = () => {
      if (disabled) {
        return isDark ? 'rgba(255,255,255,0.05)' : 'transparent';
      }
      if (selected) {
        return '#4D5BFF';
      }
      return isDark ? 'rgba(255,255,255,0.10)' : 'transparent';
    };

    const getBorderWidth = () => {
      if (disabled) {
        return isDark ? 1 : 0;
      }
      return selected ? 0 : (isDark ? 1 : 0);
    };

    return (
      <TouchableOpacity
        style={[
          styles.material3Chip,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: getBorderWidth(),
            opacity: disabled ? 0.6 : 1,
            ...(selected && styles.material3ChipSelected),
          },
          style,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.material3ChipText,
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

  // Style par défaut (pour autres écrans)
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
  // Material 3 style - full-width chips
  material3Chip: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  material3ChipSelected: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.20,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  material3ChipText: {
    fontFamily: tokens.typography.label.fontFamily, // Inter_500Medium
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});
