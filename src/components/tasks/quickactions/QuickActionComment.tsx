import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SuiviCard } from '../../ui/SuiviCard';
import { SuiviText } from '../../ui/SuiviText';
import { SuiviButton } from '../../ui/SuiviButton';
import { Task } from '../../../api/tasks';
import { tokens } from '../../../theme';

export interface QuickActionCommentProps {
  task: Task;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

/**
 * QuickActionComment
 * 
 * Composant Quick Action permettant à l'utilisateur de commenter une tâche.
 * 
 * @see docs/mobile/ai_pulse_and_kpi_api.md pour le contrat API complet
 * Les mêmes clés i18n seront utilisées pour l'API backend.
 */
export function QuickActionComment({ task, onActionComplete }: QuickActionCommentProps) {
  console.log("QA-TEST: QuickActionComment", task.id);
  const { t } = useTranslation();
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim()) {
      onActionComplete({
        actionType: 'COMMENT',
        details: { comment: comment.trim() },
      });
      setComment('');
    }
  };

  return (
    <SuiviCard padding="md" elevation="sm" variant="default" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        {t('quickActions.comment.label')}
      </SuiviText>
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={setComment}
        placeholder={t('quickActions.comment.placeholder')}
        multiline
        numberOfLines={3}
        placeholderTextColor={tokens.colors.neutral.medium}
      />
      <View style={styles.buttonContainer}>
        <SuiviButton
          title={t('quickActions.comment.send')}
          variant="primary"
          onPress={handleSubmit}
          disabled={!comment.trim()}
        />
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
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.border.default,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.sm,
    minHeight: 80,
    fontSize: 14,
    fontFamily: tokens.typography.fontFamily.primary,
    color: tokens.colors.text.primary,
    marginBottom: tokens.spacing.sm,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
  },
});

