import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SuiviText } from './SuiviText';
import { tokens } from '@theme';
import type { SuiviTag } from '../../types/task';

export interface SuiviTagIndicatorProps {
  tag: SuiviTag;
}

/**
 * SuiviTagIndicator
 * 
 * Composant visuel pour afficher un tag (pastille colorée + texte).
 * Style Monday-like mais 100% Design System Suivi.
 * 
 * Caractéristiques :
 * - Pastille arrondie avec tokens.radius.xl
 * - Fond coloré issu des tokens Suivi (via tag.color)
 * - Padding horizontal tokens.spacing.xs/sm
 * - Texte label (13px)
 * - Gestion automatique light/dark via tokens
 * - Aucune couleur hors DS Suivi
 */
export function SuiviTagIndicator({ tag }: SuiviTagIndicatorProps) {
  const theme = useTheme();
  const isDark = theme.dark;

  // Calculer la couleur du texte pour garantir la lisibilité
  // Pour les couleurs claires, utiliser un texte sombre, pour les couleurs sombres, utiliser un texte clair
  const getTextColor = (backgroundColor: string): string => {
    // Couleurs claires (jaune, lightBlue, etc.) → texte sombre
    if (
      backgroundColor === tokens.colors.accent.maize ||
      backgroundColor === tokens.colors.accent.maizeLight ||
      backgroundColor === tokens.colors.avatar.lightBlue ||
      backgroundColor === tokens.colors.avatar.yellow
    ) {
      return isDark
        ? tokens.colors.text.dark.primary
        : tokens.colors.text.primary;
    }
    // Couleurs sombres → texte clair
    return tokens.colors.text.onPrimary;
  };

  const textColor = getTextColor(tag.color);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tag.color,
          borderRadius: tokens.radius.xl,
        },
      ]}
    >
      <SuiviText
        variant="label"
        style={[
          styles.text,
          {
            color: textColor,
          },
        ]}
      >
        {tag.name}
      </SuiviText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    flexShrink: 1,
    minWidth: 0,
    maxWidth: '100%',
  },
  text: {
    // Le style de texte est géré par SuiviText variant="label"
  },
});

