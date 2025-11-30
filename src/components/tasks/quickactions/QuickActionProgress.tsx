import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { useTranslation } from 'react-i18next';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import { SuiviButton } from '@components/ui/SuiviButton';
import type { Task } from '../../../types/task';
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
function QuickActionProgressComponent({
  task,
  payload,
  onActionComplete,
}: QuickActionProgressProps) {
  const { t } = useTranslation();
  const min = payload?.min ?? 0;
  const max = payload?.max ?? 100;

  // Initialiser avec task.progress comme source de vérité (fallback sur payload.value puis min)
  const initialValue = task?.progress ?? payload?.value ?? min;
  const [progress, setProgress] = useState(initialValue);
  const [isSliding, setIsSliding] = useState(false);
  
  // Flag pour éviter la réécrasure du state local pendant la mise à jour optimiste
  const isUpdatingRef = useRef(false);
  const pendingValueRef = useRef<number | null>(null);
  
  // Flag pour empêcher la synchronisation juste après handleSlidingComplete (avant handleSubmit)
  const justFinishedSlidingRef = useRef(false);

  // Synchroniser progress avec task.progress uniquement si l'utilisateur n'est pas en train de glisser
  // IMPORTANT : Ne pas réécraser si une mise à jour est en cours pour éviter le double clignotement
  // IMPORTANT : Ne pas réécraser juste après handleSlidingComplete (avant handleSubmit) pour éviter le rollback
  useEffect(() => {
    if (isUpdatingRef.current) {
      // Si la valeur backend correspond à notre valeur en attente, synchronisation réussie
      if (task?.progress === pendingValueRef.current) {
        isUpdatingRef.current = false;
        pendingValueRef.current = null;
      }
      // Ne pas réécraser pendant la mise à jour
      return;
    }
    
    // Ne pas synchroniser si on vient juste de finir le glissement (avant handleSubmit)
    // Cela évite le rollback de la valeur locale avec l'ancienne valeur de task.progress
    if (justFinishedSlidingRef.current) {
      return;
    }
    
    // Synchronisation normale (valeur backend différente de locale sans mise à jour en cours)
    // ET seulement si l'utilisateur n'est pas en train de glisser
    if (!isSliding && task?.progress !== undefined && task.progress !== progress) {
      setProgress(task.progress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.progress, isSliding]);

  // Handler pour onValueChange : mise à jour locale uniquement
  const handleValueChange = (value: number) => {
    setIsSliding(true);
    setProgress(value);
    // Réinitialiser le flag si l'utilisateur recommence à glisser
    // (après avoir fini un glissement précédent sans sauvegarder)
    justFinishedSlidingRef.current = false;
  };

  // Handler pour onSlidingComplete : mise à jour locale uniquement (pas d'appel à onActionComplete)
  const handleSlidingComplete = (value: number) => {
    setIsSliding(false);
    setProgress(value);
    // Marquer qu'on vient de finir le glissement pour empêcher le useEffect de synchroniser
    // avec l'ancienne valeur de task.progress avant que handleSubmit ne soit appelé
    justFinishedSlidingRef.current = true;
  };

  const handleSubmit = () => {
    // Réinitialiser le flag de fin de glissement (on va maintenant sauvegarder)
    justFinishedSlidingRef.current = false;
    
    // Marquer la mise à jour en cours
    isUpdatingRef.current = true;
    pendingValueRef.current = progress;
    // Le bouton reste disponible pour une confirmation manuelle si nécessaire
    onActionComplete({
      actionType: 'PROGRESS',
      details: { progress, min, max },
    });
  };

  return (
    <SuiviCard padding="md" elevation="sm" variant="default" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        {t('quickActions.progress.label', { min, max })}
      </SuiviText>
      
      <Slider
        value={progress}
        minimumValue={min}
        maximumValue={max}
        step={1}
        minimumTrackTintColor={tokens.colors.brand.primary}
        maximumTrackTintColor={tokens.colors.surface.variant}
        thumbTintColor={tokens.colors.brand.primary}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        style={styles.slider}
      />

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
  slider: {
    width: '100%',
    height: 32,
    marginBottom: tokens.spacing.sm,
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

// Stabiliser le composant avec React.memo pour éviter les re-renders inutiles
export const QuickActionProgress = React.memo(QuickActionProgressComponent);
