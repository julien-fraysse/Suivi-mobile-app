import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SuiviText } from './SuiviText';
import { tokens } from '../../theme';

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
    const fontWeight = isSelected ? '600' : '500';
    const backgroundColor = isSelected
      ? (theme.dark ? tokens.colors.surface.darkVariant : '#F2F2F6')
      : 'transparent';

    const tabShadow = isSelected && !theme.dark
      ? Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
          },
          android: {
            elevation: 1,
          },
        })
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
          style={{ 
            color: textColor, 
            fontWeight,
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
    ? (theme.dark 
        ? {} // Pas de shadow en dark mode
        : Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
            },
            android: {
              elevation: 4,
            },
          }))
    : (theme.dark 
        ? {} // Pas de shadow en dark mode
        : Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            },
            android: {
              elevation: 2,
            },
          }));

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
    borderRadius: 14, // Style par défaut (compact)
    padding: 4,
    width: 'auto',
    alignSelf: 'center',
    // backgroundColor et borderColor sont définis dynamiquement selon le thème
  },
  segmentedControlFullWidth: {
    borderRadius: 20, // tokens.radius.xl pour style Gemini 3
    padding: 6, // Augmenté pour plus d'espace
    width: '100%', // Largeur pleine pour style Gemini 3
    minHeight: 60, // Height 60-70px pour style Gemini 3
    alignSelf: 'stretch', // S'étend sur toute la largeur
  },
  filterTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8, // Style par défaut
    paddingHorizontal: 18,
    borderRadius: 10,
    minWidth: 90,
    backgroundColor: 'transparent',
  },
  filterTabFullWidth: {
    paddingVertical: 12, // Augmenté pour meilleures touch zones (style Gemini 3)
    paddingHorizontal: 20, // Augmenté pour meilleures touch zones (style Gemini 3)
    borderRadius: 14, // Arrondi adapté au nouveau conteneur
    flex: 1, // Taille uniforme pour les boutons (style Gemini 3)
    minWidth: 0, // Permet au flex: 1 de fonctionner
  },
  filterTabActive: {
    // Shadow est appliquée conditionnellement selon le thème dans le render
    // En dark mode, pas de shadow pour l'onglet actif
  },
});

