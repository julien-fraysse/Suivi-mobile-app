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
}

/**
 * SegmentedControl
 * 
 * Composant de contrôle segmenté réutilisable avec pill mobile.
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
}: SegmentedControlProps) {
  const theme = useTheme();

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
          {
            backgroundColor,
            opacity: pressed ? 0.8 : 1,
            ...tabShadow,
          },
        ]}
      >
        <SuiviText variant="label" style={{ color: textColor, fontWeight }}>
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

  const containerShadow = theme.dark 
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
      });

  return (
    <View style={[
      styles.segmentedControl,
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
    borderRadius: 14,
    padding: 4,
    width: 'auto',
    alignSelf: 'center',
    // backgroundColor et borderColor sont définis dynamiquement selon le thème
  },
  filterTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    minWidth: 90,
    backgroundColor: 'transparent',
  },
  filterTabActive: {
    // Shadow est appliquée conditionnellement selon le thème dans le render
    // En dark mode, pas de shadow pour l'onglet actif
  },
});

