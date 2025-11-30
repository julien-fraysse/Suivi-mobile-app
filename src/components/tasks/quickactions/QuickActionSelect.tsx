import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SuiviCard } from '@components/ui/SuiviCard';
import { SuiviText } from '@components/ui/SuiviText';
import { SuiviButton } from '@components/ui/SuiviButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Task } from '../../../types/task';
import { tokens } from '@theme';

export interface QuickActionSelectProps {
  task: Task;
  payload?: Record<string, any>;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}

/**
 * QuickActionSelect
 * 
 * Composant Quick Action permettant à l'utilisateur de sélectionner une option parmi une liste déroulante.
 * 
 * @see docs/mobile/ai_pulse_and_kpi_api.md pour le contrat API complet
 * Les mêmes clés i18n seront utilisées pour l'API backend.
 */
export function QuickActionSelect({ task, payload, onActionComplete }: QuickActionSelectProps) {
  console.log("QA-TEST: QuickActionSelect", task.id);
  const { t } = useTranslation();
  // Initialiser avec task.selectValue comme source de vérité (fallback sur payload.value puis null)
  const initialValue = task?.selectValue ?? payload?.value ?? null;
  const [selectedOption, setSelectedOption] = useState<string | null>(initialValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const options = payload?.options || ['Option A', 'Option B', 'Option C'];
  
  // Flag pour éviter la réécrasure du state local pendant la mise à jour optimiste
  const isUpdatingRef = useRef(false);
  const pendingValueRef = useRef<string | null>(null);

  // Synchroniser selectedOption avec task.selectValue
  // IMPORTANT : Ne pas réécraser si une mise à jour est en cours pour éviter le double clignotement
  useEffect(() => {
    if (isUpdatingRef.current) {
      // Si la valeur backend correspond à notre valeur en attente, synchronisation réussie
      if (task?.selectValue === pendingValueRef.current) {
        isUpdatingRef.current = false;
        pendingValueRef.current = null;
      }
      // Ne pas réécraser pendant la mise à jour
      return;
    }
    
    // Synchronisation normale (valeur backend différente de locale sans mise à jour en cours)
    if (task?.selectValue !== undefined && task.selectValue !== selectedOption) {
      setSelectedOption(task.selectValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.selectValue]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    // Pas d'appel à onActionComplete ici - uniquement mise à jour locale
  };

  const handleSubmit = () => {
    if (selectedOption) {
      // Marquer la mise à jour en cours
      isUpdatingRef.current = true;
      pendingValueRef.current = selectedOption;
      onActionComplete({
        actionType: 'SELECT',
        details: { selectedOption },
      });
      // Ne pas réinitialiser selectedOption immédiatement - attendre la confirmation backend
      // setSelectedOption(null); // SUPPRIMÉ - sera géré par le useEffect après confirmation
    }
  };

  return (
    <SuiviCard padding="md" elevation="sm" variant="default" style={styles.container}>
      <SuiviText variant="label" color="secondary" style={styles.label}>
        {t('quickActions.select.label')}
      </SuiviText>
      
      <Pressable
        style={styles.dropdown}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <SuiviText variant="body" color={selectedOption ? "primary" : "secondary"}>
          {selectedOption || t('quickActions.select.placeholder')}
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
            title={t('quickActions.select.confirm')}
            variant="primary"
            onPress={handleSubmit}
          />
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

