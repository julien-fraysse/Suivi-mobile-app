import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from 'react-native-paper';
import { tokens } from '@theme';

export interface SuiviCardProps {
  children: React.ReactNode;
  padding?: keyof typeof tokens.spacing;
  elevation?: 'none' | 'sm' | 'card' | 'lg';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'outlined';
  noShadow?: boolean;
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
  noShadow = false,
}: SuiviCardProps) {
  const theme = useTheme();
  const isDark = theme.dark;

  const getShadowStyle = () => {
    // Si noShadow est activé, retourner un style sans shadow
    if (noShadow) {
      return {
        shadowColor: 'transparent',
        elevation: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      };
    }
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

  // shadowWrapper : shadow + backgroundColor opaque (évite le flicker dans les Swipeable)
  const shadowWrapperStyle = [
    styles.shadowWrapper,
    {
      borderRadius: tokens.radius.lg, // Pour éviter les coins carrés de la shadow
      backgroundColor, // Même backgroundColor que roundedWrapper - rend la carte opaque
      ...getShadowStyle(),
    },
    style, // Le style passé en prop est appliqué au shadowWrapper
  ];

  // roundedWrapper : borderRadius + overflow: 'hidden', backgroundColor, pas de shadow
  const roundedWrapperStyle = [
    styles.roundedWrapper,
    {
      borderRadius: tokens.radius.lg,
      backgroundColor,
      ...getBorderStyle(),
    },
  ];

  const cardContent = (
    <View style={shadowWrapperStyle}>
      <View style={roundedWrapperStyle}>
        <View style={{ padding: tokens.spacing[padding] }}>
          {children}
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          pressed && { opacity: 0.7 },
        ]}
        onPress={onPress}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  shadowWrapper: {
    // backgroundColor appliqué dynamiquement (même que roundedWrapper)
    // Pas d'overflow ici - la shadow doit pouvoir dépasser
  },
  roundedWrapper: {
    overflow: 'hidden',
    // borderRadius et backgroundColor appliqués dynamiquement
  },
});
