import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import { SuiviButton } from '@components/ui/SuiviButton';
import { Task } from '../../../api/tasks';
import { tokens } from '@theme';

export interface QuickActionApprovalProps {
  task: Task;
  payload?: Record<string, any>;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

/**
 * QuickActionApproval
 * 
 * Composant Quick Action permettant à l'utilisateur d'approuver ou de refuser une demande.
 * 
 * @see docs/mobile/ai_pulse_and_kpi_api.md pour le contrat API complet
 * Les mêmes clés i18n seront utilisées pour l'API backend.
 */
export function QuickActionApproval({ task, payload, onActionComplete }: QuickActionApprovalProps) {
  console.log("QA-TEST: QuickActionApproval", task.id);
  const { t } = useTranslation();
  const handleApprove = () => {
    onActionComplete({
      actionType: 'APPROVAL',
      details: { decision: 'approved', requestId: payload?.requestId },
    });
  };

  const handleReject = () => {
    onActionComplete({
      actionType: 'APPROVAL',
      details: { decision: 'rejected', requestId: payload?.requestId },
    });
  };

  return (
    <SuiviCard padding="md" elevation="sm" variant="default" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        {t('quickActions.approval.label')}
      </SuiviText>
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <SuiviButton title={t('quickActions.approval.approve')} variant="primary" onPress={handleApprove} />
        </View>
        <View style={styles.buttonWrapper}>
          <SuiviButton title={t('quickActions.approval.reject')} variant="ghost" onPress={handleReject} />
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
  buttonRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  buttonWrapper: {
    flex: 1,
  },
});

