import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviCard } from '../../ui/SuiviCard';
import { SuiviText } from '../../ui/SuiviText';
import { Task } from '../../../api/tasks';
import { tokens } from '../../../theme';

export interface QuickActionCheckboxProps {
  task: Task;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

export function QuickActionCheckbox({ task, onActionComplete }: QuickActionCheckboxProps) {
  console.log("QA-TEST: QuickActionCheckbox", task.id);
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onActionComplete({
      actionType: 'CHECKBOX',
      details: { checked: newValue },
    });
  };

  return (
    <SuiviCard padding="md" elevation="sm" variant="default" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        Cocher les étapes
      </SuiviText>
      <Pressable onPress={handleToggle} style={styles.checkboxContainer}>
        <MaterialCommunityIcons
          name={isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
          size={24}
          color={isChecked ? tokens.colors.semantic.success : tokens.colors.neutral.medium}
        />
        <SuiviText variant="body" color={isChecked ? 'primary' : 'secondary'} style={styles.checkboxLabel}>
          Tâche complétée
        </SuiviText>
      </Pressable>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  checkboxLabel: {
    flex: 1,
  },
});

