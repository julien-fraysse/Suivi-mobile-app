import React from 'react';
import { useTranslation } from 'react-i18next';
import { SegmentedControl, type SegmentedControlOption } from './SegmentedControl';

export interface TasksFilterControlProps {
  value: string;
  onChange: (newValue: string) => void;
}

/**
 * TasksFilterControl
 * 
 * Composant wrapper réutilisable pour les filtres de tâches.
 * Encapsule SegmentedControl avec les 3 options standard :
 * - All / Tous
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
}: TasksFilterControlProps) {
  const { t } = useTranslation();

  const options: SegmentedControlOption[] = [
    { key: 'all', label: t('tasks.filters.all') },
    { key: 'active', label: t('tasks.filters.active') },
    { key: 'completed', label: t('tasks.filters.completed') },
  ];

  return (
    <SegmentedControl
      options={options}
      value={value}
      onChange={onChange}
    />
  );
}

