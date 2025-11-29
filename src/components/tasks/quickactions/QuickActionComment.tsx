import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import { SuiviButton } from '@components/ui/SuiviButton';
import type { Task } from '../../../types/task';
import { tokens } from '@theme';

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
  const theme = useTheme();
  const isDark = theme.dark;
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
    <SuiviCard padding="md" elevation="sm" variant="outlined" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        {t('quickActions.comment.label')}
      </SuiviText>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.onSurface,
            backgroundColor: theme.colors.surface,
            borderColor: isDark ? tokens.colors.border.darkMode.default : tokens.colors.border.default,
          },
        ]}
        value={comment}
        onChangeText={setComment}
        placeholder={t('quickActions.comment.placeholder')}
        multiline
        numberOfLines={3}
        placeholderTextColor={isDark ? theme.colors.onSurfaceVariant : tokens.colors.neutral.medium}
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
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.sm,
    minHeight: 80,
    fontSize: 14,
    fontFamily: tokens.typography.fontFamily.primary,
    marginBottom: tokens.spacing.sm,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
  },
});

