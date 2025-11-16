/**
 * Mock Tasks Data
 * 
 * Données mockées pour les tâches.
 * Utilisé par TasksProvider pour le MVP.
 * 
 * TODO: Remplacer par des appels API Suivi (GET /api/tasks) quand le backend sera prêt.
 */

import type { Task, TaskStatus } from '../../tasks/tasks.types';

/**
 * Génère une date ISO au format YYYY-MM-DD
 */
function dateISOString(daysOffset: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

/**
 * Génère une date ISO complète (avec heure)
 */
function dateISOFull(daysOffset: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
}

/**
 * MOCK_TASKS
 * 
 * Ensemble de tâches mockées pour le MVP.
 * Contient au moins 15 tâches variées avec :
 * - Des statuts variés (todo, in_progress, blocked, done)
 * - Des dates cohérentes (certaines dues today, certaines passées, certaines futures)
 * - Des projets différents
 * - Des descriptions variées
 */
export const MOCK_TASKS: Task[] = [
  // Tâches dues aujourd'hui
  {
    id: 'task-1',
    title: 'Implémenter le design system Suivi',
    description: 'Créer un design system complet avec tokens, composants réutilisables et documentation. Inclure les polices Inter et IBM Plex Mono, les couleurs Suivi (violet, jaune, gris, sand), et les composants de base (buttons, cards, inputs, etc.).',
    status: 'in_progress',
    dueDate: dateISOString(0), // Due today
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-5),
    updatedAt: dateISOFull(-1),
  },
  {
    id: 'task-2',
    title: 'Review design mockups',
    description: 'Revoir les maquettes du design system et valider avec l\'équipe design.',
    status: 'todo',
    dueDate: dateISOString(0), // Due today
    projectId: 'project-design-system',
    projectName: 'Design System',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-3),
    updatedAt: dateISOFull(-2),
  },
  
  // Tâches actives (todo, in_progress)
  {
    id: 'task-3',
    title: 'Configurer la navigation entre écrans',
    description: 'Mettre en place la navigation stack et tab avec React Navigation, gérer les transitions et les paramètres de route.',
    status: 'todo',
    dueDate: dateISOString(2),
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-4),
    updatedAt: dateISOFull(-4),
  },
  {
    id: 'task-4',
    title: 'Créer les composants UI réutilisables',
    description: 'Implémenter les composants de base : buttons, cards, inputs, avatars, etc.',
    status: 'done',
    dueDate: dateISOString(-5),
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-10),
    updatedAt: dateISOFull(-6),
  },
  {
    id: 'task-5',
    title: 'Créer la page de profil utilisateur',
    description: 'Page de profil avec informations personnelles, paramètres, et préférences.',
    status: 'todo',
    dueDate: dateISOString(3),
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-3),
    updatedAt: dateISOFull(-3),
  },
  {
    id: 'task-6',
    title: 'Optimiser les performances de la liste des tâches',
    description: 'Implémenter la virtualisation avec FlatList, optimiser les re-renders avec useMemo et useCallback.',
    status: 'blocked',
    dueDate: dateISOString(6),
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-5),
    updatedAt: dateISOFull(-2),
  },
  {
    id: 'task-7',
    title: 'Ajouter le système de notifications push',
    description: 'Intégrer Firebase Cloud Messaging pour les notifications push sur iOS et Android.',
    status: 'todo',
    dueDate: dateISOString(-1), // Was due yesterday
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-7),
    updatedAt: dateISOFull(-7),
  },
  {
    id: 'task-8',
    title: 'Créer les tests unitaires pour les composants',
    description: 'Écrire des tests unitaires avec Jest et React Native Testing Library pour les composants critiques.',
    status: 'in_progress',
    dueDate: dateISOString(1),
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-4),
    updatedAt: dateISOFull(-1),
  },
  {
    id: 'task-9',
    title: 'Intégrer les polices Inter et IBM Plex Mono',
    description: 'Charger et configurer les polices custom dans l\'application avec Expo Fonts.',
    status: 'done',
    dueDate: dateISOString(-8),
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-12),
    updatedAt: dateISOFull(-8),
  },
  {
    id: 'task-10',
    title: 'Setup CI/CD pipeline',
    description: 'Configurer GitHub Actions pour les tests automatiques et le déploiement sur TestFlight et Play Store.',
    status: 'todo',
    dueDate: dateISOString(5),
    projectId: 'project-backend-api',
    projectName: 'Backend API',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-2),
    updatedAt: dateISOFull(-2),
  },
  
  // Tâches complétées
  {
    id: 'task-11',
    title: 'Créer la structure de base du projet',
    description: 'Initialiser le projet Expo, configurer TypeScript, et mettre en place la structure de dossiers.',
    status: 'done',
    dueDate: dateISOString(-15),
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-20),
    updatedAt: dateISOFull(-16),
  },
  {
    id: 'task-12',
    title: 'Configurer le thème dark/light mode',
    description: 'Implémenter le système de thème avec React Native Paper et permettre le basculement entre dark et light mode.',
    status: 'done',
    dueDate: dateISOString(-10),
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-12),
    updatedAt: dateISOFull(-10),
  },
  {
    id: 'task-13',
    title: 'Implémenter l\'authentification',
    description: 'Mettre en place le flux d\'authentification avec token JWT et gestion de session.',
    status: 'done',
    dueDate: dateISOString(-7),
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-10),
    updatedAt: dateISOFull(-7),
  },
  
  // Tâches bloquées
  {
    id: 'task-14',
    title: 'Intégrer l\'API Suivi backend',
    description: 'Connecter l\'application mobile à l\'API Suivi backend pour récupérer et synchroniser les données.',
    status: 'blocked',
    dueDate: dateISOString(10),
    projectId: 'project-backend-api',
    projectName: 'Backend API',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-1),
    updatedAt: dateISOFull(-1),
  },
  
  // Tâches futures
  {
    id: 'task-15',
    title: 'Ajouter la fonctionnalité de recherche',
    description: 'Implémenter une barre de recherche pour filtrer les tâches par titre, description, ou projet.',
    status: 'todo',
    dueDate: dateISOString(7),
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-2),
    updatedAt: dateISOFull(-2),
  },
  {
    id: 'task-16',
    title: 'Implémenter les filtres avancés',
    description: 'Ajouter des filtres par projet, assigné, date d\'échéance, et statut combinés.',
    status: 'todo',
    dueDate: dateISOString(8),
    projectId: 'project-mobile-app',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    assigneeInitials: 'JF',
    createdAt: dateISOFull(-1),
    updatedAt: dateISOFull(-1),
  },
];


