import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import type { Task } from '../../../types/task';
import { tokens } from '@theme';

export interface QuickActionCheckboxProps {
  task: Task;
  payload?: Record<string, any>;
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
export function QuickActionCheckbox({ task, payload, onActionComplete }: QuickActionCheckboxProps) {
  console.log("QA-TEST: QuickActionCheckbox", task.id);
  const { t } = useTranslation();
  // Initialiser avec task.checkboxValue comme source de vérité (fallback sur payload.value puis false)
  const initialValue = task?.checkboxValue ?? payload?.value ?? false;
  const [isChecked, setIsChecked] = useState(initialValue);
  
  // Flag pour éviter la réécrasure du state local pendant la mise à jour optimiste
  const isUpdatingRef = useRef(false);
  const pendingValueRef = useRef<boolean | null>(null);

  // Synchroniser isChecked avec task.checkboxValue
  // IMPORTANT : Ne pas réécraser si une mise à jour est en cours pour éviter le double clignotement
  useEffect(() => {
    if (isUpdatingRef.current) {
      // Si la valeur backend correspond à notre valeur en attente, synchronisation réussie
      if (task?.checkboxValue === pendingValueRef.current) {
        isUpdatingRef.current = false;
        pendingValueRef.current = null;
      }
      // Ne pas réécraser pendant la mise à jour
      return;
    }
    
    // Synchronisation normale (valeur backend différente de locale sans mise à jour en cours)
    if (task?.checkboxValue !== undefined && task.checkboxValue !== isChecked) {
      setIsChecked(task.checkboxValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.checkboxValue]);

  const handleToggle = () => {
    const newValue = !isChecked;
    // Marquer la mise à jour en cours
    isUpdatingRef.current = true;
    pendingValueRef.current = newValue;
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

