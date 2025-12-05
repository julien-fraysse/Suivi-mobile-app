import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SuiviText } from './SuiviText';
import { tokens, getShadowStyle } from '@theme';

export interface SegmentedControlOption {
  key: string;
  label: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (newValue: string) => void;
  /**
   * Style variant : 'default' (compact, auto-width) ou 'fullWidth' (style Gemini 3, largeur pleine)
   * @default 'default'
   */
  variant?: 'default' | 'fullWidth';
}

/**
 * SegmentedControl
 * 
 * Composant de boutons segmentés réutilisable (Mes Tâches, Home, etc.).
 * 
 * Rendu visuel unique aligné avec le design Suivi.
 * Utilisé pour :
 * - MyTasksScreen : Tous / Actives / Terminées
 * - HomeScreen : Tous / Boards / Portails
 * 
 * Prépare le terrain pour un futur branchement API :
 * - ex: GET /activities?filter=board|portal
 * - ex: GET /tasks?status=active|done
 * 
 * Design :
 * - Light mode : Container blanc avec bordure gris clair et ombre légère
 * - Dark mode : Container surface sombre avec bordure subtile, pas d'ombre
 * - Pill qui se déplace derrière l'option active (gris clair en light, gris moyen en dark)
 * - Taille compacte, centrée, auto-dimensionnée
 * - Support complet light/dark mode avec tokens Suivi
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi pour les couleurs.
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  variant = 'default',
}: SegmentedControlProps) {
  const theme = useTheme();
  const isFullWidth = variant === 'fullWidth';

  const renderTab = (option: SegmentedControlOption) => {
    const isSelected = value === option.key;
    const textColor = isSelected 
      ? (theme.dark ? tokens.colors.text.dark.primary : tokens.colors.text.primary)
      : (theme.dark ? tokens.colors.text.dark.secondary : tokens.colors.text.secondary);
    const fontFamily = isSelected 
      ? tokens.typography.display.fontFamily  // Inter_700Bold
      : tokens.typography.h1.fontFamily;      // Inter_600SemiBold
    const backgroundColor = isSelected
      ? (theme.dark ? tokens.colors.surface.darkVariant : '#F2F2F6')
      : 'transparent';

    const tabShadow = isSelected && !theme.dark
      ? getShadowStyle('sm', theme.dark)
      : {};

    return (
      <Pressable
        key={option.key}
        onPress={() => onChange(option.key)}
        style={({ pressed }) => [
          styles.filterTab,
          isFullWidth && styles.filterTabFullWidth,
          {
            backgroundColor,
            opacity: pressed ? 0.8 : 1,
            ...tabShadow,
          },
        ]}
      >
        <SuiviText 
          variant="label"
          numberOfLines={1}
          style={{ 
            color: textColor, 
            fontFamily,
            fontSize: isFullWidth ? 13 : undefined, // Réduire légèrement la taille de police (style Gemini 3)
            textAlign: 'center', // Textes centrés
          }}
        >
          {option.label}
        </SuiviText>
      </Pressable>
    );
  };

  const containerBackgroundColor = theme.dark 
    ? tokens.colors.surface.dark 
    : tokens.colors.background.default;
  
  const containerBorderColor = theme.dark 
    ? tokens.colors.border.darkMode.default 
    : tokens.colors.border.default;

  const containerShadow = isFullWidth
    ? getShadowStyle('card', theme.dark)
    : getShadowStyle('sm', theme.dark);

  return (
    <View style={[
      styles.segmentedControl,
      isFullWidth && styles.segmentedControlFullWidth,
      {
        backgroundColor: containerBackgroundColor,
        borderColor: containerBorderColor,
        ...containerShadow,
      },
    ]}>
      {options.map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: tokens.radius.md, // Style par défaut (compact)
    padding: 4,
    width: 'auto',
    alignSelf: 'center',
    // backgroundColor et borderColor sont définis dynamiquement selon le thème
  },
  segmentedControlFullWidth: {
    borderRadius: tokens.radius.xl, // Style Gemini 3
    padding: 6, // Augmenté pour plus d'espace
    width: '100%', // Largeur pleine pour style Gemini 3
    minHeight: 60, // Height 60-70px pour style Gemini 3
    alignSelf: 'stretch', // S'étend sur toute la largeur
  },
  filterTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8, // Style par défaut
    paddingHorizontal: tokens.spacing.xl, // 24px
    borderRadius: tokens.radius.md,
    minWidth: 80,
    backgroundColor: 'transparent',
  },
  filterTabFullWidth: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12, // Augmenté pour meilleures touch zones (style Gemini 3)
    paddingHorizontal: tokens.spacing.md, // Réduit pour éviter la troncature "…" sur iOS réel / TestFlight
    borderRadius: tokens.radius.md, // Arrondi adapté au nouveau conteneur
    flex: 1, // Taille uniforme pour les boutons (style Gemini 3)
    minWidth: 80,
  },
  filterTabActive: {
    // Shadow est appliquée conditionnellement selon le thème dans le render
    // En dark mode, pas de shadow pour l'onglet actif
  },
});

