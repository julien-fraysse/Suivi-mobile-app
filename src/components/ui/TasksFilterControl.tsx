import React from 'react';
import { useTranslation } from 'react-i18next';
import { SegmentedControl, type SegmentedControlOption } from './SegmentedControl';

export interface TasksFilterControlProps {
  value: string;
  onChange: (newValue: string) => void;
  variant?: 'default' | 'fullWidth';
}

/**
 * TasksFilterControl
 * 
 * Composant wrapper réutilisable pour les filtres de tâches.
 * Encapsule SegmentedControl avec les 2 options standard :
 * - Active / Actives
 * - Completed / Terminées
 * 
 * Utilisation :
 * <TasksFilterControl
 *   value={filter}
 *   onChange={setFilter}
 * />
 */
export function TasksFilterControl({
  value,
  onChange,
  variant = 'fullWidth',
}: TasksFilterControlProps) {
  const { t } = useTranslation();

  const options: SegmentedControlOption[] = [
    { key: 'active', label: t('tasks.filters.active') },
    { key: 'completed', label: t('tasks.filters.completed') },
  ];

  return (
    <SegmentedControl
      variant={variant}
      options={options}
      value={value}
      onChange={onChange}
    />
  );
}

