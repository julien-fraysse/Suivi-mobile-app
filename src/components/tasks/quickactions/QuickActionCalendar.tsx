import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import { SuiviButton } from '@components/ui/SuiviButton';
import type { Task } from '../../../types/task';
import { tokens } from '@theme';

export interface QuickActionCalendarProps {
  task: Task;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

/**
 * QuickActionCalendar
 * 
 * Composant Quick Action permettant à l'utilisateur de définir une échéance via un calendrier.
 * 
 * @see docs/mobile/ai_pulse_and_kpi_api.md pour le contrat API complet
 * Les mêmes clés i18n seront utilisées pour l'API backend.
 */
export function QuickActionCalendar({ task, onActionComplete }: QuickActionCalendarProps) {
  console.log("QA-TEST: QuickActionCalendar", task.id);
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = () => {
    // Pour un vrai calendrier, utiliser react-native-date-picker ou DateTimePicker
    // Ici, on simule une sélection de date
    const date = new Date().toISOString().split('T')[0];
    setSelectedDate(date);
    onActionComplete({
      actionType: 'CALENDAR',
      details: { date },
    });
  };

  return (
    <SuiviCard padding="md" elevation="sm" variant="default" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        {t('quickActions.calendar.label')}
      </SuiviText>
      <View style={styles.contentContainer}>
        {selectedDate && (
          <SuiviText variant="body" color="primary" style={styles.dateText}>
            {t('quickActions.calendar.selectedDate', { date: selectedDate })}
          </SuiviText>
        )}
        <View style={styles.buttonContainer}>
          <SuiviButton title={t('quickActions.calendar.chooseDate')} variant="primary" onPress={handleDateSelect} />
        </View>
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
  contentContainer: {
    alignItems: 'center',
  },
  dateText: {
    marginBottom: tokens.spacing.sm,
  },
  buttonContainer: {
    width: '100%',
  },
});

