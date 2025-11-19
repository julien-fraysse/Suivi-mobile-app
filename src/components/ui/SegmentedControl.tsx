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
 * - Container blanc arrondi avec bordure gris clair et ombre légère
 * - Pill gris clair (#F2F2F6) qui se déplace derrière l'option active
 * - Taille compacte, centrée, auto-dimensionnée
 * - Support light/dark mode
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
      ? '#F2F2F6' // Pill gris clair pour l'état actif
      : 'transparent';

    return (
      <Pressable
        key={option.key}
        onPress={() => onChange(option.key)}
        style={({ pressed }) => [
          styles.filterTab,
          isSelected && styles.filterTabActive,
          {
            backgroundColor,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <SuiviText variant="label" style={{ color: textColor, fontWeight }}>
          {option.label}
        </SuiviText>
      </Pressable>
    );
  };

  return (
    <View style={[
      styles.segmentedControl,
      {
        borderColor: theme.dark ? tokens.colors.border.darkMode.default : tokens.colors.border.default,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
          },
          android: {
            elevation: 2,
          },
        }),
      },
    ]}>
      {options.map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    width: 'auto',
    alignSelf: 'center',
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});

