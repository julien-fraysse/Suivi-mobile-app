import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import { Task } from '../../../api/tasks';
import { tokens } from '@theme';

export interface QuickActionCheckboxProps {
  task: Task;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

/**
 * QuickActionCheckbox
 * 
 * Composant Quick Action permettant à l'utilisateur de cocher/décocher une tâche.
 * 
 * @see docs/mobile/ai_pulse_and_kpi_api.md pour le contrat API complet
 * Les mêmes clés i18n seront utilisées pour l'API backend.
 */
export function QuickActionCheckbox({ task, onActionComplete }: QuickActionCheckboxProps) {
  console.log("QA-TEST: QuickActionCheckbox", task.id);
  const { t } = useTranslation();
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
        {t('quickActions.checkbox.label')}
      </SuiviText>
      <Pressable onPress={handleToggle} style={styles.checkboxContainer}>
        <MaterialCommunityIcons
          name={isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
          size={24}
          color={isChecked ? tokens.colors.semantic.success : tokens.colors.neutral.medium}
        />
        <SuiviText variant="body" color={isChecked ? 'primary' : 'secondary'} style={styles.checkboxLabel}>
          {t('quickActions.checkbox.completed')}
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

