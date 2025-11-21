import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SuiviCard } from '../../ui/SuiviCard';
import { SuiviText } from '../../ui/SuiviText';
import { Task } from '../../../api/tasks';
import { tokens } from '../../../theme';

export interface QuickActionWeatherProps {
  task: Task;
  payload?: Record<string, any>;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

export function QuickActionWeather({ task, payload, onActionComplete }: QuickActionWeatherProps) {
  const options = payload?.options ?? ['sunny', 'cloudy', 'storm'];
  const [selected, setSelected] = useState<string | null>(null);

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
        return 'Ensoleillé';
      case 'cloudy':
        return 'Nuageux';
      case 'storm':
        return 'Orageux';
      default:
        return option;
    }
  };

  return (
    <SuiviCard padding="md" elevation="sm" variant="default" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        Indiquer la météo
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

