/**
 * Projects Mock Data
 * 
 * Export centralisé des données mockées pour les projets.
 * Reprend EXACTEMENT les mocks actuels sans transformation.
 */

import type { Project } from './suiviMock';

// Reprendre EXACTEMENT les mocks de suiviMock.ts (lignes 178-203)
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Mobile App',
    color: '#4F5DFF',
    taskCount: 8,
  },
  {
    id: '2',
    name: 'Backend API',
    color: '#FDD447',
    taskCount: 12,
  },
  {
    id: '3',
    name: 'Design System',
    color: '#00C853',
    taskCount: 5,
  },
  {
    id: '4',
    name: 'Documentation',
    color: '#98928C',
    taskCount: 3,
  },
];

