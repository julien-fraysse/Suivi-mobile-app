import React from 'react';
import { Text, TextProps } from 'react-native';
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
 * 
 * En dark mode :
 * - Les titres (h1, h2, display) utilisent #FFFFFF (white)
 * - Le texte secondaire (secondary) utilise #CACACA (soft gray)
 */
export const SuiviText: React.FC<SuiviTextProps> = ({
  variant = 'body',
  color = 'primary',
  style,
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme.dark;

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
  
  // Determine text color based on variant, color prop, and theme
  const getTextColor = () => {
    // Inverse color is always white (for text on colored backgrounds)
    if (color === 'inverse') {
      return '#FFFFFF';
    }

    // In dark mode, apply dark mode text colors
    if (isDark) {
      // Titles (h1, h2, display) always use white in dark mode when color is primary
      if ((variant === 'h1' || variant === 'h2' || variant === 'display') && color === 'primary') {
        return tokens.colors.text.dark.primary; // #FFFFFF
      }
      // All secondary, disabled, hint text uses soft gray in dark mode
      if (color === 'secondary' || color === 'disabled' || color === 'hint') {
        return tokens.colors.text.dark.secondary; // #CACACA
      }
      // Body text with primary color uses white in dark mode
      if (color === 'primary') {
        return tokens.colors.text.dark.primary; // #FFFFFF
      }
    }

    // Light mode - use standard colors
    const colorMap = {
      primary: tokens.colors.neutral.dark, // #4F4A45
      secondary: tokens.colors.neutral.medium, // #98928C
      disabled: tokens.colors.neutral.medium, // #98928C
      hint: tokens.colors.neutral.medium, // #98928C
    };
    return colorMap[color] || colorMap.primary;
  };
  
  return (
    <Text
      style={[
        variantStyles[variant],
        {
          color: getTextColor(),
        },
        style,
      ]}
      {...props}
    />
  );
};

