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
 * - Séparateur NÉON HORIZONTAL (glow uniquement) :
 *   • Une seule barre néon diffuse, fine et élégante (8px height)
 *   • Gradient HORIZONTAL : transparent → lumineux → transparent
 *   • Pas de barre solide, uniquement le glow
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi.
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
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
 * Helper : génère une couleur hex avec opacité
 * @param hex - Couleur hex de base (ex: '#4F5DFF')
 * @param opacityHex - Opacité en hex (ex: '66' pour 40%, '40' pour 25%)
 * @returns Couleur hex avec opacité (ex: '#4F5DFF66')
 */
function withOpacity(hex: string, opacityHex: string): string {
  return `${hex}${opacityHex}`;
}

// ============================================
// NEON GLOW OPACITY CONSTANTS (hex values)
// ============================================
// Le glow horizontal utilise un gradient symétrique :
// transparent → medium → strong → medium → transparent
// Cela crée un effet de néon avec centre lumineux
const NEON_OPACITY = {
  light: {
    strong: '50',   // 50% - centre du néon
    medium: '22',   // 13% - transition vers les bords
  },
  dark: {
    strong: '75',   // 20% - centre du néon (plus subtil)
    medium: '11',   // 7% - transition vers les bords
  },
} as const;

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
  
  // Couleur du badge (adopte la couleur de section)
  // Background = couleur de section + opacité faible (15-20%)
  // Text = couleur de section pure
  const badgeBackgroundColor = isDark
    ? `${sectionColor}33` // 20% opacity en dark mode
    : `${sectionColor}26`; // 15% opacity en light mode
  
  const badgeTextColor = sectionColor; // Texte = couleur de section pure

  // ============================================
  // NEON HORIZONTAL GRADIENT (5 stops symétrique)
  // ============================================
  // Effet néon : transparent → lumineux au centre → transparent
  // Le gradient est HORIZONTAL (rayonne latéralement, pas verticalement)
  const opacitySet = isDark ? NEON_OPACITY.dark : NEON_OPACITY.light;
  const neonGradientColors: [string, string, string, string, string] = [
    'transparent',                                  // 0% - bord gauche
    withOpacity(sectionColor, opacitySet.medium),   // 20% - transition
    withOpacity(sectionColor, opacitySet.strong),   // 50% - centre lumineux
    withOpacity(sectionColor, opacitySet.medium),   // 80% - transition
    'transparent',                                  // 100% - bord droit
  ];

  return (
    <View>
      {/* Header pressable */}
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
        
        {/* Chevron (même couleur que la section) */}
        <MaterialCommunityIcons
          name={isCollapsed ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={sectionColor}
        />
      </Pressable>
      
      {/* ============================================
          SÉPARATEUR NÉON HORIZONTAL (GLOW UNIQUEMENT)
          ============================================
          Une seule barre néon diffuse, fine et élégante.
          Pas de barre solide - uniquement le glow horizontal.
      */}
      <View style={styles.neonContainer}>
        <LinearGradient
          colors={neonGradientColors}
          locations={[0, 0.2, 0.5, 0.8, 1]}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 1, y: 0.3 }}
          style={styles.neonGlow}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}

// ============================================
// NEON DIMENSIONS (glow uniquement, sans barre solide)
// ============================================
const NEON_GLOW_WIDTH = 140;     // 140% de la largeur (dépasse largement)
const NEON_GLOW_LEFT = '-20%';   // Centrage du glow élargi
const NEON_GLOW_HEIGHT = 2;      // Hauteur fine (8-10px) pour rendu élégant
const NEON_GLOW_TOP = 0;         // Léger décalage sous le header

const styles = StyleSheet.create({
  // ============================================
  // HEADER STYLES
  // ============================================
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
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
    minWidth: 24,
    height: 24,
    borderRadius: tokens.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.xs,
    marginRight: tokens.spacing.sm,
  },
  badgeText: {
    fontWeight: '600',
  },
  
  // ============================================
  // NÉON HORIZONTAL STYLES (glow uniquement)
  // ============================================
  
  // Container du néon (glow seul, pas de barre solide)
  neonContainer: {
    marginTop: tokens.spacing.xs,
    marginBottom: tokens.spacing.md, // Espace sous le séparateur avant la première carte
    height: NEON_GLOW_TOP + NEON_GLOW_HEIGHT,
    overflow: 'hidden',
  },
  
  // Glow horizontal unique (fine barre néon diffuse)
  neonGlow: {
    position: 'absolute',
    top: NEON_GLOW_TOP,
    left: NEON_GLOW_LEFT,
    width: `${NEON_GLOW_WIDTH}%`,
    height: NEON_GLOW_HEIGHT,
    borderRadius: tokens.radius.full,
  },
});


