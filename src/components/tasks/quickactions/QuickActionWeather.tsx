import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import type { Task } from '../../../types/task';
import { tokens } from '@theme';

export interface QuickActionWeatherProps {
  task: Task;
  payload?: Record<string, any>;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

/**
 * QuickActionWeather
 * 
 * Composant Quick Action permettant à l'utilisateur d'indiquer la météo.
 * 
 * @see docs/mobile/ai_pulse_and_kpi_api.md pour le contrat API complet
 * Les mêmes clés i18n seront utilisées pour l'API backend.
 */
export function QuickActionWeather({ task, payload, onActionComplete }: QuickActionWeatherProps) {
  console.log("QA-TEST: QuickActionWeather", task.id);
  const { t } = useTranslation();
  const options = payload?.options ?? ['sunny', 'cloudy', 'storm'];
  // Initialiser avec task.weather comme source de vérité (fallback sur payload.value puis null)
  const initialValue = task?.weather ?? payload?.value ?? null;
  const [selected, setSelected] = useState<string | null>(initialValue);

  // Synchroniser selected avec task.weather
  useEffect(() => {
    if (task?.weather !== undefined && task.weather !== selected) {
      setSelected(task.weather);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.weather]);

  const handleSelect = (option: string) => {
    setSelected(option);
    onActionComplete({
      actionType: 'WEATHER',
      details: { weather: option },
    });
  };

  const getWeatherIcon = (option: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (option) {
      case 'sunny':
        return 'weather-sunny';
      case 'cloudy':
        return 'weather-cloudy';
      case 'storm':
        return 'weather-lightning';
      default:
        return 'weather-cloudy';
    }
  };

  const getWeatherLabel = (option: string): string => {
    switch (option) {
      case 'sunny':
        return t('quickActions.weather.sunny');
      case 'cloudy':
        return t('quickActions.weather.cloudy');
      case 'storm':
        return t('quickActions.weather.storm');
      default:
        return option;
    }
  };

  return (
    <SuiviCard padding="md" elevation="sm" variant="default" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        {t('quickActions.weather.label')}
      </SuiviText>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => handleSelect(option)}
            style={[
              styles.optionButton,
              selected === option && styles.optionButtonSelected,
            ]}
          >
            <MaterialCommunityIcons
              name={getWeatherIcon(option)}
              size={32}
              color={selected === option ? tokens.colors.brand.primary : tokens.colors.neutral.medium}
            />
            <SuiviText
              variant="caption"
              color={selected === option ? 'primary' : 'secondary'}
              style={styles.optionLabel}
            >
              {getWeatherLabel(option)}
            </SuiviText>
          </Pressable>
        ))}
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: tokens.spacing.sm,
  },
  optionButton: {
    alignItems: 'center',
    padding: tokens.spacing.sm,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border.default,
    flex: 1,
  },
  optionButtonSelected: {
    borderColor: tokens.colors.brand.primary,
    backgroundColor: `${tokens.colors.brand.primary}14`,
  },
  optionLabel: {
    marginTop: tokens.spacing.xs,
  },
});

