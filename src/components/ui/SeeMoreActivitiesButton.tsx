/**
 * SeeMoreActivitiesButton
 * 
 * Bouton stylé iOS-like pour afficher "Voir plus d'activités".
 * 
 * Design:
 * - Hauteur : 42px
 * - BorderRadius : 10px
 * - Background adapté au thème (light/dark)
 * - Texte : Inter SemiBold 14
 * - Icône chevron-right alignée à droite
 * - Pressed state avec opacité réduite
 * 
 * API future:
 * - Pas d'appel direct à l'API dans ce composant
 * - Simple CTA pour pagination côté client
 * - Le parent (HomeScreen) gère l'incrémentation du limit
 * 
 * Comment remplacer demain par des données backend:
 * - Le composant reste identique, seul le handler onPress change
 * - Le parent peut appeler une fonction API pour charger plus d'activités
 * - Exemple: onPress={() => loadMoreActivities(limit + 5)}
 * 
 * Pourquoi le composant est isolé:
 * - Réutilisable dans d'autres sections (Notifications, Tasks, etc.)
 * - Style cohérent dans toute l'application
 * - Facilite la maintenance et les tests
 * 
 * @example
 * ```tsx
 * <SeeMoreActivitiesButton
 *   onPress={() => setLimit(limit + 5)}
 *   label="Voir plus d'activités"
 * />
 * ```
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { SuiviText } from './SuiviText';
import { tokens } from '@theme';

export interface SeeMoreActivitiesButtonProps {
  /**
   * Handler appelé lors du press
   */
  onPress: () => void;
  
  /**
   * Label du bouton
   * @default "Voir plus d'activités"
   */
  label?: string;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: any;
}

/**
 * SeeMoreActivitiesButton
 * 
 * Bouton iOS-like pour afficher "Voir plus d'activités".
 */
export function SeeMoreActivitiesButton({ 
  onPress, 
  label = "Voir plus d'activités",
  style 
}: SeeMoreActivitiesButtonProps) {
  const theme = useTheme();
  const isDark = theme.dark;

  // Background adapté au thème
  const backgroundColor = isDark 
    ? 'rgba(255,255,255,0.08)' 
    : 'rgba(0,0,0,0.04)';

  // Couleur du texte adaptée au thème
  const textColor = isDark 
    ? 'rgba(255,255,255,0.85)' 
    : 'rgba(0,0,0,0.65)';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { 
          backgroundColor,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <SuiviText 
          variant="body" 
          style={[styles.label, { color: textColor }]}
        >
          {label}
        </SuiviText>
        <MaterialIcons
          name="chevron-right"
          size={20}
          color={textColor}
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600', // Inter SemiBold
    fontFamily: tokens.typography.body.fontFamily,
  },
  icon: {
    marginLeft: 8,
  },
});

