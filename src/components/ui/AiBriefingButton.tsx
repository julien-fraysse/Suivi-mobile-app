import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { SuiviText } from './SuiviText';
import { tokens } from '@theme';
import { useTranslation } from 'react-i18next';

export interface AiBriefingButtonProps {
  /**
   * Callback appelé quand le bouton est pressé
   * 
   * TODO: When Suivi API is ready, this will trigger:
   *   - API call to POST /api/briefing/generate
   *   - Navigation to BriefingScreen with generated content
   */
  onPress?: () => void;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: any;
}

/**
 * AiBriefingButton
 * 
 * AI briefing CTA avec icône robot dans un cercle jaune semi-transparent.
 * 
 * Bouton moderne pour accéder au "AI Daily Briefing" avec icône robot IA.
 * 
 * Design:
 * - Gradient violet Suivi (linear-gradient 90deg: #7A5CFF → #4F5DFF)
 * - Hauteur: 64px
 * - Border radius: 20px (cohérent avec le design system)
 * - Ombre légère adaptée au light/dark mode
 * - Layout: Icône robot IA dans cercle jaune à gauche, texte (titre + sous-titre) au centre, flèche à droite
 * 
 * Structure:
 * - Ligne 1: "AI Daily Briefing" (semi-bold, blanc)
 * - Ligne 2: "Synthétise mes tâches" (small label, blanc avec opacité 80%)
 * 
 * API Integration:
 * - MVP: No-op handler (onPress vide)
 * - Future: POST /api/briefing/generate avec userId, date, filters
 * - Response: { summary: string, tasks: Task[], insights: string[] }
 * - Navigation vers BriefingScreen avec les données générées
 * 
 * @example
 * ```tsx
 * <AiBriefingButton onPress={() => navigation.navigate('Briefing')} />
 * ```
 */
export function AiBriefingButton({ onPress, style }: AiBriefingButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.dark;

  // Couleurs du gradient (violet Suivi)
  const gradientColors = ['#7A5CFF', '#4F5DFF'];

  // Ombre adaptée au thème
  const shadowStyle = isDark
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      }
    : {
        shadowColor: '#7A5CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      };

  return (
    <Pressable
      onPress={onPress || (() => {})}
      style={({ pressed }) => [
        styles.container,
        shadowStyle,
        {
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {/* Icône robot IA dans cercle jaune semi-transparent à gauche */}
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name="robot-outline"
            size={24}
            color="#FFE071"
          />
        </View>

        {/* Colonne texte au centre */}
        <View style={styles.textContainer}>
          <SuiviText
            variant="body"
            style={[styles.title, { color: '#FFFFFF' }]}
          >
            {t('notifications.aiBriefing')}
          </SuiviText>
          <SuiviText
            variant="label"
            style={[styles.subtitle, { color: '#FFFFFFCC' }]}
          >
            {t('notifications.aiBriefingSubtitle') || 'Synthétise mes tâches'}
          </SuiviText>
        </View>

        {/* Flèche à droite */}
        <MaterialCommunityIcons
          name="arrow-right"
          size={20}
          color="#FFFFFF"
          style={styles.arrow}
        />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    marginHorizontal: tokens.spacing.lg,
    borderRadius: 20,
    overflow: 'hidden', // Important pour afficher le gradient proprement
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '600', // semi-bold
    fontSize: 16,
    marginBottom: 2,
  },
  subtitle: {
    color: '#FFFFFFCC', // Blanc avec 80% d'opacité
    fontSize: 12,
    fontWeight: '400',
  },
  arrow: {
    marginLeft: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,224,113,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});

