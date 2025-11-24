import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tokens } from '@theme';

export interface QuickActionPreviewProps {
  /** Type d'action (utilise 'type' du type Task normalisé, compatible avec 'actionType' pour rétrocompatibilité) */
  actionType?: "COMMENT" | "APPROVAL" | "RATING" | "PROGRESS" | "WEATHER" | "CALENDAR" | "CHECKBOX" | "SELECT" | string;
}

/**
 * QuickActionPreview
 * 
 * Affiche une icône discrète indiquant le type de Quick Action disponible.
 * Prévisualisation minimale pour la liste des tâches.
 * 
 * Compatible avec le type Task normalisé (quickAction.type) et l'ancien format (quickAction.actionType).
 */
export function QuickActionPreview({ actionType }: QuickActionPreviewProps) {
  console.log("QA-DIAG: QuickActionPreview actionType =", actionType);

  if (!actionType) {
    return null;
  }

  if (actionType === "PROGRESS") {
    return null;
  }

  const iconConfig = getIconForActionType(actionType);
  
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={iconConfig.name}
        size={16}
        color={iconConfig.color}
      />
    </View>
  );
}

/**
 * Retourne l'icône et la couleur selon le type d'action
 */
function getIconForActionType(actionType: string): { name: keyof typeof MaterialCommunityIcons.glyphMap; color: string } {
  switch (actionType) {
    case "COMMENT":
      return { name: "message-text", color: tokens.colors.neutral.medium };
    case "APPROVAL":
      return { name: "check-circle", color: tokens.colors.semantic.success };
    case "RATING":
      return { name: "star", color: tokens.colors.accent.maize };
    case "PROGRESS":
      return { name: "speedometer", color: tokens.colors.brand.primary };
    case "WEATHER":
      return { name: "weather-cloudy", color: tokens.colors.neutral.medium };
    case "CALENDAR":
      return { name: "calendar", color: tokens.colors.brand.primary };
    case "CHECKBOX":
      return { name: "checkbox-marked", color: tokens.colors.semantic.success };
    case "SELECT":
      return { name: "menu-down", color: tokens.colors.neutral.medium };
    default:
      return { name: "circle", color: tokens.colors.neutral.medium };
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: tokens.spacing.xs, // Espacement entre le badge de statut et l'icône QuickAction
  },
});

