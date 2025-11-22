import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import { SuiviButton } from '@components/ui/SuiviButton';
import { Task } from '../../../api/tasks';
import { tokens } from '@theme';

export interface QuickActionProgressProps {
  task: Task;
  payload?: Record<string, any>;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

/**
 * QuickActionProgress
 * 
 * Composant Quick Action permettant à l'utilisateur de marquer une progression via un slider.
 * 
 * @see docs/mobile/ai_pulse_and_kpi_api.md pour le contrat API complet
 * Les mêmes clés i18n seront utilisées pour l'API backend.
 */
export function QuickActionProgress({
  task,
  payload,
  onActionComplete,
}: QuickActionProgressProps) {
  const { t } = useTranslation();
  const min = payload?.min ?? 0;
  const max = payload?.max ?? 100;

  const [progress, setProgress] = useState(min);
  const trackWidth = useRef(1);

  const handleMove = (x: number) => {
    if (trackWidth.current <= 0) return;
    const relative = Math.max(0, Math.min(x, trackWidth.current));
    const percent = relative / trackWidth.current;
    const newValue = Math.round(min + percent * (max - min));
    setProgress(newValue);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleMove(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        handleMove(evt.nativeEvent.locationX);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  const handleSubmit = () => {
    onActionComplete({
      actionType: 'PROGRESS',
      details: { progress, min, max },
    });
  };

  const progressPercent = ((progress - min) / (max - min)) * 100;

  return (
    <SuiviCard padding="md" elevation="sm" variant="default" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        {t('quickActions.progress.label', { min, max })}
      </SuiviText>
      
      <View
        style={styles.track}
        onLayout={handleTrackLayout}
        {...panResponder.panHandlers}
      >
        <View style={[styles.filled, { width: `${progressPercent}%` }]} />
        <View style={[styles.thumb, { left: `${progressPercent}%`, marginLeft: -12 }]} />
      </View>

      <SuiviText variant="body" color="primary" style={styles.value}>
        {progress}%
      </SuiviText>

      <View style={styles.buttonContainer}>
        <SuiviButton
          title={t('quickActions.progress.save')}
          onPress={handleSubmit}
          variant="primary"
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
  track: {
    height: 8,
    backgroundColor: tokens.colors.neutral.light,
    borderRadius: 4,
    width: '100%',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
    position: 'relative',
  },
  filled: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 8,
    backgroundColor: tokens.colors.brand.primary,
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: tokens.colors.brand.primary,
    borderWidth: 2,
    borderColor: tokens.colors.background.default,
  },
  value: {
    textAlign: 'center',
    marginTop: tokens.spacing.xs,
    marginBottom: tokens.spacing.sm,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
  },
});
