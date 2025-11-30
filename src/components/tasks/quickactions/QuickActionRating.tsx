import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import type { Task } from '../../../types/task';
import { tokens } from '@theme';

export interface QuickActionRatingProps {
  task: Task;
  payload?: Record<string, any>;
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
export function QuickActionRating({ task, payload, onActionComplete }: QuickActionRatingProps) {
  console.log("QA-TEST: QuickActionRating", task.id);
  const { t } = useTranslation();
  // Initialiser avec task.rating comme source de vérité (fallback sur payload.value puis 0)
  const initialValue = task?.rating ?? payload?.value ?? 0;
  const [rating, setRating] = useState(initialValue);
  
  // Flag pour éviter la réécrasure du state local pendant la mise à jour optimiste
  const isUpdatingRef = useRef(false);
  const pendingValueRef = useRef<number | null>(null);

  // Synchroniser rating avec task.rating
  // IMPORTANT : Ne pas réécraser si une mise à jour est en cours pour éviter le double clignotement
  useEffect(() => {
    if (isUpdatingRef.current) {
      // Si la valeur backend correspond à notre valeur en attente, synchronisation réussie
      if (task?.rating === pendingValueRef.current) {
        isUpdatingRef.current = false;
        pendingValueRef.current = null;
      }
      // Ne pas réécraser pendant la mise à jour
      return;
    }
    
    // Synchronisation normale (valeur backend différente de locale sans mise à jour en cours)
    if (task?.rating !== undefined && task.rating !== rating) {
      setRating(task.rating);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.rating]);

  const handleRatingSelect = (value: number) => {
    // Marquer la mise à jour en cours
    isUpdatingRef.current = true;
    pendingValueRef.current = value;
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

