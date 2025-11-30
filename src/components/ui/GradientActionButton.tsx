import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { tokens, getShadowStyle } from '@theme';

export interface GradientActionButtonProps {
  /**
   * Nom de l'icône MaterialCommunityIcons
   */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  
  /**
   * Texte du bouton
   */
  label: string;
  
  /**
   * Callback appelé lors du clic
   */
  onPress: () => void;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: ViewStyle;
}

/**
 * GradientActionButton
 * 
 * Bouton d'action avec dégradé violet → bleu pour les actions de sécurité.
 * 
 * Design :
 * - Largeur 100%
 * - Hauteur ~56px
 * - Fond : dégradé violet → bleu (#6366F1 → #8B5CF6)
 * - Coins : borderRadius: tokens.radius.md (12px)
 * - Icône blanc à gauche (taille 18, spacing 12)
 * - Texte blanc semi-bold centré verticalement
 * - Shadow légère (0, 4, 12, rgba(0,0,0,0.08))
 */
export function GradientActionButton({
  icon,
  label,
  onPress,
  style,
}: GradientActionButtonProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, getShadowStyle('card', isDark), style]}
    >
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color="#FFFFFF"
            style={styles.icon}
          />
          <Text style={styles.label}>
            {label}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    borderRadius: tokens.radius.md,
  },
  gradient: {
    flex: 1,
    borderRadius: tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});

