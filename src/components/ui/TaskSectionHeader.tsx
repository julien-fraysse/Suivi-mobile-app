/**
 * TaskSectionHeader
 * 
 * Composant de header pour les sections de tâches dans MyTasksScreen.
 * 
 * Design :
 * - Icône ronde colorée selon le type de section (overdue, today, etc.)
 * - Label en gras avec couleur selon la section
 * - Badge rond avec compteur de tâches
 * - Chevron pour collapse/expand
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi.
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviText } from './SuiviText';
import { tokens } from '@theme';
import type { SectionName } from '../../hooks/useMyWork';

export interface TaskSectionHeaderProps {
  /** Nom de la section (overdue, today, thisWeek, etc.) */
  sectionName: SectionName;
  /** Label traduit de la section */
  label: string;
  /** Nombre de tâches dans la section */
  count: number;
  /** État collapsed de la section */
  isCollapsed: boolean;
  /** Callback pour toggle la section */
  onToggle: () => void;
}

/**
 * Mapping des icônes par section
 */
const SECTION_ICONS: Record<SectionName, keyof typeof MaterialCommunityIcons.glyphMap> = {
  overdue: 'alert-circle-outline',
  today: 'calendar-today',
  thisWeek: 'calendar-week',
  nextWeek: 'calendar-range',
  later: 'calendar-clock',
  noDate: 'calendar-blank',
};

/**
 * Retourne la couleur associée à une section
 */
function getSectionColor(sectionName: SectionName): string {
  return tokens.colors.section[sectionName] || tokens.colors.neutral.medium;
}

/**
 * TaskSectionHeader
 * 
 * Header de section avec icône, label coloré, badge compteur et chevron.
 */
export function TaskSectionHeader({
  sectionName,
  label,
  count,
  isCollapsed,
  onToggle,
}: TaskSectionHeaderProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  
  const sectionColor = getSectionColor(sectionName);
  const iconName = SECTION_ICONS[sectionName];
  
  // Couleur de fond de l'icône (cercle) - plus claire que la couleur principale
  const iconBackgroundColor = isDark
    ? `${sectionColor}33` // 20% opacity en dark mode
    : `${sectionColor}1A`; // 10% opacity en light mode
  
  // Couleur du badge
  const badgeBackgroundColor = isDark
    ? tokens.colors.surface.darkVariant
    : tokens.colors.neutral.light;
  
  const badgeTextColor = isDark
    ? tokens.colors.text.dark.primary
    : tokens.colors.text.primary;

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.7 },
      ]}
    >
      {/* Icône dans cercle coloré */}
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <MaterialCommunityIcons
          name={iconName}
          size={18}
          color={sectionColor}
        />
      </View>
      
      {/* Label de la section */}
      <View style={styles.labelContainer}>
        <SuiviText
          variant="h2"
          style={[styles.label, { color: sectionColor }]}
        >
          {label}
        </SuiviText>
      </View>
      
      {/* Badge compteur */}
      <View style={[styles.badge, { backgroundColor: badgeBackgroundColor }]}>
        <SuiviText
          variant="label"
          style={[styles.badgeText, { color: badgeTextColor }]}
        >
          {count}
        </SuiviText>
      </View>
      
      {/* Chevron */}
      <MaterialCommunityIcons
        name={isCollapsed ? 'chevron-down' : 'chevron-up'}
        size={24}
        color={tokens.colors.text.secondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.sm,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
  },
  badge: {
    minWidth: 28,
    height: 28,
    borderRadius: tokens.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.sm,
    marginRight: tokens.spacing.sm,
  },
  badgeText: {
    fontWeight: '600',
  },
});

