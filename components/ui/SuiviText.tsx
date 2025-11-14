import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'disabled' | 'hint' | 'inverse';
  weight?: 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
}

export const SuiviText: React.FC<SuiviTextProps> = ({
  variant = 'body1',
  color = 'primary',
  weight = 'regular',
  style,
  ...props
}) => {
  const theme = useTheme();
  
  // Variant styles
  const variantStyles = {
    h1: {
      fontSize: tokens.typography.fontSize.xxxl,
      lineHeight: tokens.typography.lineHeight.xxxl,
      fontWeight: tokens.typography.fontWeight.bold,
    },
    h2: {
      fontSize: tokens.typography.fontSize.xxl,
      lineHeight: tokens.typography.lineHeight.xxl,
      fontWeight: tokens.typography.fontWeight.bold,
    },
    h3: {
      fontSize: tokens.typography.fontSize.xl,
      lineHeight: tokens.typography.lineHeight.xl,
      fontWeight: tokens.typography.fontWeight.semibold,
    },
    h4: {
      fontSize: tokens.typography.fontSize.lg,
      lineHeight: tokens.typography.lineHeight.lg,
      fontWeight: tokens.typography.fontWeight.medium,
    },
    h5: {
      fontSize: tokens.typography.fontSize.md,
      lineHeight: tokens.typography.lineHeight.md,
      fontWeight: tokens.typography.fontWeight.medium,
    },
    h6: {
      fontSize: tokens.typography.fontSize.sm,
      lineHeight: tokens.typography.lineHeight.sm,
      fontWeight: tokens.typography.fontWeight.medium,
    },
    body1: {
      fontSize: tokens.typography.fontSize.md,
      lineHeight: tokens.typography.lineHeight.md,
      fontWeight: tokens.typography.fontWeight.regular,
    },
    body2: {
      fontSize: tokens.typography.fontSize.sm,
      lineHeight: tokens.typography.lineHeight.sm,
      fontWeight: tokens.typography.fontWeight.regular,
    },
    caption: {
      fontSize: tokens.typography.fontSize.xs,
      lineHeight: tokens.typography.lineHeight.xs,
      fontWeight: tokens.typography.fontWeight.regular,
    },
    overline: {
      fontSize: tokens.typography.fontSize.xs,
      lineHeight: tokens.typography.lineHeight.xs,
      fontWeight: tokens.typography.fontWeight.medium,
      textTransform: 'uppercase' as const,
      letterSpacing: 1.5,
    },
  };
  
  // Color mapping
  const colorMap = {
    primary: theme.colors.onSurface,
    secondary: theme.colors.onSurfaceVariant,
    disabled: theme.colors.onSurfaceDisabled,
    hint: tokens.colors.text.hint,
    inverse: theme.colors.inverseOnSurface,
  };
  
  // Weight mapping
  const weightMap = {
    thin: tokens.typography.fontWeight.thin,
    light: tokens.typography.fontWeight.light,
    regular: tokens.typography.fontWeight.regular,
    medium: tokens.typography.fontWeight.medium,
    semibold: tokens.typography.fontWeight.semibold,
    bold: tokens.typography.fontWeight.bold,
  };
  
  return (
    <Text
      style={[
        variantStyles[variant],
        {
          color: colorMap[color],
          fontWeight: weightMap[weight],
          fontFamily: tokens.typography.fontFamily.primary,
        },
        style,
      ]}
      {...props}
    />
  );
};

