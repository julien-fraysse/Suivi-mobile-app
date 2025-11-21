import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SuiviCard } from '../../ui/SuiviCard';
import { SuiviText } from '../../ui/SuiviText';
import { SuiviButton } from '../../ui/SuiviButton';
import { Task } from '../../../api/tasks';
import { tokens } from '../../../theme';

export interface QuickActionApprovalProps {
  task: Task;
  payload?: Record<string, any>;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

export function QuickActionApproval({ task, payload, onActionComplete }: QuickActionApprovalProps) {
  console.log("QA-TEST: QuickActionApproval", task.id);
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
        Approuver ou refuser
      </SuiviText>
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <SuiviButton title="Approuver" variant="primary" onPress={handleApprove} />
        </View>
        <View style={styles.buttonWrapper}>
          <SuiviButton title="Refuser" variant="ghost" onPress={handleReject} />
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

