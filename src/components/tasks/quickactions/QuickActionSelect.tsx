import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { SuiviCard } from '../../ui/SuiviCard';
import { SuiviText } from '../../ui/SuiviText';
import { SuiviButton } from '../../ui/SuiviButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '../../../api/tasks';
import { tokens } from '../../../theme';

export interface QuickActionSelectProps {
  task: Task;
  payload?: Record<string, any>;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

export function QuickActionSelect({ task, payload, onActionComplete }: QuickActionSelectProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const options = payload?.options || ['Option A', 'Option B', 'Option C'];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      onActionComplete({
        actionType: 'SELECT',
        details: { selectedOption },
      });
      setSelectedOption(null);
    }
  };

  return (
    <SuiviCard padding="md" elevation="sm" variant="default" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        Sélectionner une option
      </SuiviText>
      
      <Pressable
        style={styles.dropdown}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <SuiviText variant="body" color={selectedOption ? "primary" : "secondary"}>
          {selectedOption || 'Sélectionner...'}
        </SuiviText>
        <MaterialCommunityIcons
          name={isDropdownOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={tokens.colors.neutral.medium}
        />
      </Pressable>

      {isDropdownOpen && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <Pressable
              key={index}
              style={[
                styles.option,
                selectedOption === option && styles.selectedOption,
              ]}
              onPress={() => handleSelect(option)}
            >
              <SuiviText
                variant="body"
                color={selectedOption === option ? "primary" : "secondary"}
              >
                {option}
              </SuiviText>
              {selectedOption === option && (
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color={tokens.colors.brand.primary}
                />
              )}
            </Pressable>
          ))}
        </View>
      )}

      {selectedOption && (
        <View style={styles.buttonContainer}>
          <SuiviButton
            variant="primary"
            size="small"
            onPress={handleSubmit}
          >
            Confirmer
          </SuiviButton>
        </View>
      )}
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
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.border.default,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  optionsContainer: {
    borderWidth: 1,
    borderColor: tokens.colors.border.default,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.sm,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.default,
  },
  selectedOption: {
    backgroundColor: tokens.colors.neutral.light,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
  },
});

