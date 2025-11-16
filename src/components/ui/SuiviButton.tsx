import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

/**
 * SuiviButton
 * 
 * Bouton principal réutilisable du UI Kit Suivi pour toutes les actions importantes.
 * Variantes : primary (par défaut), ghost (transparent), destructive.
 * Gère les états disabled et loading.
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi :
 * - brand.primary pour les boutons primary
 * - spacing, radius (16 par défaut), typography
 * - Transitions douces (opacity)
 */
export function SuiviButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: SuiviButtonProps) {
  const theme = useTheme();

  const getBackgroundColor = () => {
    if (disabled) {
      return tokens.colors.neutral.light; // #E8E8E8
    }
    switch (variant) {
      case 'primary':
        return tokens.colors.brand.primary; // #4F5DFF
      case 'ghost':
        return 'transparent';
      case 'destructive':
        return tokens.colors.semantic.error; // #D32F2F
      default:
        return tokens.colors.brand.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return tokens.colors.neutral.medium; // #98928C
    }
    switch (variant) {
      case 'primary':
      case 'destructive':
        return '#FFFFFF'; // Blanc sur primary/error
      case 'ghost':
        return tokens.colors.brand.primary; // #4F5DFF
      default:
        return '#FFFFFF';
    }
  };

  const getBorderStyle = () => {
    if (variant === 'ghost' && !disabled) {
      return {
        borderWidth: 1,
        borderColor: tokens.colors.brand.primary, // #4F5DFF
      };
    }
    return {};
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          opacity: disabled || loading ? 0.6 : 1,
          width: fullWidth ? '100%' : 'auto',
          ...getBorderStyle(),
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            {
              color: getTextColor(),
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.lg, // 16px par défaut
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    fontFamily: tokens.typography.label.fontFamily, // Inter_500Medium
    fontSize: tokens.typography.label.fontSize, // 13
    lineHeight: tokens.typography.label.fontSize * 1.3, // Approx line height
  },
});
