import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '@theme';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showBackButton?: boolean;
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * ScreenHeader
 * 
 * Composant d'en-tête standardisé pour tous les écrans.
 * Affiche un titre, optionnellement un sous-titre, et des actions (back, right action).
 * Utilise la typographie standard de l'app pour une cohérence visuelle.
 */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  showBackButton = false,
  spacing = 'lg',
}: ScreenHeaderProps) {
  const theme = useTheme();

  const getMarginBottom = () => {
    switch (spacing) {
      case 'none':
        return 0;
      case 'xs':
        return tokens.spacing.xs;
      case 'sm':
        return tokens.spacing.sm;
      case 'md':
        return tokens.spacing.md;
      case 'lg':
        return tokens.spacing.lg;
      default:
        return tokens.spacing.lg;
    }
  };

  return (
    <View style={[styles.container, { marginBottom: getMarginBottom() }]}>
      <View style={styles.headerRow}>
        {showBackButton && onBack && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                color: theme.dark 
                  ? tokens.colors.text.dark.primary // #FFFFFF en dark mode
                  : theme.colors.onSurface, // Paper gère en light mode
              },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.dark
                    ? tokens.colors.text.dark.secondary // #CACACA en dark mode
                    : theme.colors.onSurfaceVariant, // Paper gère en light mode
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {rightAction && (
          <View style={styles.rightAction}>{rightAction}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginBottom géré dynamiquement via prop spacing
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
  },
  backButton: {
    marginRight: tokens.spacing.md,
    padding: tokens.spacing.xs,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: tokens.typography.h4.fontSize,
    fontWeight: 'bold',
    lineHeight: tokens.typography.h4.lineHeight,
  },
  subtitle: {
    fontSize: tokens.typography.body2.fontSize,
    marginTop: tokens.spacing.xs,
    lineHeight: tokens.typography.body2.lineHeight,
  },
  rightAction: {
    marginLeft: tokens.spacing.md,
  },
});


