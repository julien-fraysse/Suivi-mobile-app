import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviCard } from '../../ui/SuiviCard';
import { SuiviText } from '../../ui/SuiviText';
import { Task } from '../../../api/tasks';
import { tokens } from '../../../theme';

export interface QuickActionRatingProps {
  task: Task;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

export function QuickActionRating({ task, onActionComplete }: QuickActionRatingProps) {
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
        Noter (1 à 5 étoiles)
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

