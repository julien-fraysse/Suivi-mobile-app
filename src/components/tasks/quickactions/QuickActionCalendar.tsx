import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SuiviCard } from '../../ui/SuiviCard';
import { SuiviText } from '../../ui/SuiviText';
import { SuiviButton } from '../../ui/SuiviButton';
import { Task } from '../../../api/tasks';
import { tokens } from '../../../theme';

export interface QuickActionCalendarProps {
  task: Task;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

export function QuickActionCalendar({ task, onActionComplete }: QuickActionCalendarProps) {
  console.log("QA-TEST: QuickActionCalendar", task.id);
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
        Définir l'échéance
      </SuiviText>
      <View style={styles.contentContainer}>
        {selectedDate && (
          <SuiviText variant="body" color="primary" style={styles.dateText}>
            Date sélectionnée : {selectedDate}
          </SuiviText>
        )}
        <View style={styles.buttonContainer}>
          <SuiviButton title="Choisir une date" variant="primary" onPress={handleDateSelect} />
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

