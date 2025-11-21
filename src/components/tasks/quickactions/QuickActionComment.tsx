import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { SuiviCard } from '../../ui/SuiviCard';
import { SuiviText } from '../../ui/SuiviText';
import { SuiviButton } from '../../ui/SuiviButton';
import { Task } from '../../../api/tasks';
import { tokens } from '../../../theme';

export interface QuickActionCommentProps {
  task: Task;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

export function QuickActionComment({ task, onActionComplete }: QuickActionCommentProps) {
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
        Répondre à un commentaire
      </SuiviText>
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={setComment}
        placeholder="Tapez votre commentaire..."
        multiline
        numberOfLines={3}
        placeholderTextColor={tokens.colors.neutral.medium}
      />
      <View style={styles.buttonContainer}>
        <SuiviButton
          variant="primary"
          size="small"
          onPress={handleSubmit}
          disabled={!comment.trim()}
        >
          Envoyer
        </SuiviButton>
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

