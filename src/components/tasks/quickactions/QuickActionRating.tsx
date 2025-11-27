import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import type { Task } from '../../../types/task';
import { tokens } from '@theme';

export interface QuickActionRatingProps {
  task: Task;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

/**
 * QuickActionRating
 * 
 * Composant Quick Action permettant à l'utilisateur de noter une tâche de 1 à 5 étoiles.
 * 
 * @see docs/mobile/ai_pulse_and_kpi_api.md pour le contrat API complet
 * Les mêmes clés i18n seront utilisées pour l'API backend.
 */
export function QuickActionRating({ task, onActionComplete }: QuickActionRatingProps) {
  console.log("QA-TEST: QuickActionRating", task.id);
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);

  const handleRatingSelect = (value: number) => {
    setRating(value);
    onActionComplete({
      actionType: 'RATING',
      details: { rating: value },
    });
  };

  return (
    <SuiviCard padding="md" elevation="sm" variant="default" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        {t('quickActions.rating.label')}
      </SuiviText>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable
            key={value}
            onPress={() => handleRatingSelect(value)}
            style={styles.starButton}
          >
            <MaterialCommunityIcons
              name={value <= rating ? "star" : "star-outline"}
              size={32}
              color={value <= rating ? tokens.colors.accent.maize : tokens.colors.neutral.medium}
            />
          </Pressable>
        ))}
      </View>
    </SuiviCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.md,
  },
  label: {
    marginBottom: tokens.spacing.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: tokens.spacing.xs,
  },
  starButton: {
    padding: tokens.spacing.xs,
  },
});

