/**
 * Tags Mock Data
 * 
 * Tags centralisés pour toutes les tâches mockées.
 * Utilise exclusivement les couleurs du Design System Suivi (tokens.colors).
 */

import type { SuiviTag } from '../types/task';
import { tokens } from '@theme';

/**
 * Tags disponibles dans l'application
 */
export const mockTags: SuiviTag[] = [
  {
    id: 'tag-design',
    name: 'Design',
    color: tokens.colors.brand.primary, // #4F5DFF
  },
  {
    id: 'tag-bug',
    name: 'Bug',
    color: tokens.colors.semantic.error, // #D32F2F
  },
  {
    id: 'tag-urgent',
    name: 'Urgent',
    color: tokens.colors.accent.maize, // #FDD447
  },
  {
    id: 'tag-backend',
    name: 'Backend',
    color: tokens.colors.avatar.blue, // #5465FF
  },
  {
    id: 'tag-frontend',
    name: 'Frontend',
    color: tokens.colors.avatar.mint, // #71D6C3
  },
  {
    id: 'tag-review',
    name: 'Review',
    color: tokens.colors.avatar.green, // #0E9F6E
  },
  {
    id: 'tag-feature',
    name: 'Feature',
    color: tokens.colors.avatar.purple, // #B868FD
  },
  {
    id: 'tag-documentation',
    name: 'Doc',
    color: tokens.colors.avatar.teal, // #006D77
  },
];

/**
 * Fonction helper pour assigner 0-2 tags aléatoirement à une tâche
 * 
 * @param taskId - ID de la tâche (pour générer une sélection déterministe)
 * @returns Tableau de 0 à 2 tags
 */
export function assignRandomTags(taskId: string): SuiviTag[] {
  // Utiliser l'ID de la tâche comme seed pour une sélection déterministe
  const seed = taskId.charCodeAt(taskId.length - 1) || 0;
  const numTags = seed % 3; // 0, 1 ou 2 tags
  
  if (numTags === 0) {
    return [];
  }
  
  // Sélectionner des tags de manière déterministe basée sur l'ID
  const selectedIndices: number[] = [];
  for (let i = 0; i < numTags; i++) {
    const index = (seed + i * 3) % mockTags.length;
    if (!selectedIndices.includes(index)) {
      selectedIndices.push(index);
    } else {
      // Si le tag est déjà sélectionné, prendre le suivant
      const nextIndex = (index + 1) % mockTags.length;
      selectedIndices.push(nextIndex);
    }
  }
  
  return selectedIndices.map((idx) => mockTags[idx]);
}

