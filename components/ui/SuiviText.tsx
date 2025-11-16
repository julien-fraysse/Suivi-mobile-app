import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { tokens } from '../../theme';

export interface SuiviTextProps extends TextProps {
  variant?: 'display' | 'h1' | 'h2' | 'body' | 'label' | 'mono';
  color?: 'primary' | 'secondary' | 'disabled' | 'hint' | 'inverse';
}

/**
 * SuiviText
 * 
 * Composant de texte réutilisable utilisant EXCLUSIVEMENT les typographies Suivi (Inter + IBM Plex Mono).
 * 
 * Variantes :
 * - display : Inter Bold, 28px (titres principaux)
 * - h1 : Inter Semibold, 22px (titres de section)
 * - h2 : Inter Medium, 18px (sous-titres)
 * - body : Inter Regular, 15px (texte principal)
 * - label : Inter Medium, 13px (labels et boutons)
 * - mono : IBM Plex Mono Regular, 13px (texte technique, badges)
 * 
 * Text always Inter, sauf badges techniques et labels → Plex Mono.
 */
export const SuiviText: React.FC<SuiviTextProps> = ({
  variant = 'body',
  color = 'primary',
  style,
  ...props
}) => {
  const theme = useTheme();
  
  // Variant styles - Utilise les tokens typography
  const variantStyles = {
    display: {
      fontFamily: tokens.typography.display.fontFamily, // Inter_700Bold
      fontSize: tokens.typography.display.fontSize, // 28
    },
    h1: {
      fontFamily: tokens.typography.h1.fontFamily, // Inter_600SemiBold
      fontSize: tokens.typography.h1.fontSize, // 22
    },
    h2: {
      fontFamily: tokens.typography.h2.fontFamily, // Inter_500Medium
      fontSize: tokens.typography.h2.fontSize, // 18
    },
    body: {
      fontFamily: tokens.typography.body.fontFamily, // Inter_400Regular
      fontSize: tokens.typography.body.fontSize, // 15
    },
    label: {
      fontFamily: tokens.typography.label.fontFamily, // Inter_500Medium
      fontSize: tokens.typography.label.fontSize, // 13
    },
    mono: {
      fontFamily: tokens.typography.mono.fontFamily, // IBMPlexMono_400Regular
      fontSize: tokens.typography.mono.fontSize, // 13
    },
  };
  
  // Color mapping - Utilise les tokens colors
  const colorMap = {
    primary: tokens.colors.neutral.dark, // #4F4A45
    secondary: tokens.colors.neutral.medium, // #98928C
    disabled: tokens.colors.neutral.medium, // #98928C
    hint: tokens.colors.neutral.medium, // #98928C
    inverse: '#FFFFFF', // Blanc pour texte sur fond coloré
  };
  
  return (
    <Text
      style={[
        variantStyles[variant],
        {
          color: colorMap[color],
        },
        style,
      ]}
      {...props}
    />
  );
};

