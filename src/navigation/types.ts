/**
 * Navigation Types
 * 
 * Types TypeScript pour toutes les routes de navigation de l'application.
 * Utilisés pour sécuriser la navigation et éviter les erreurs de typage.
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import type { SuiviTag } from '../types/task';

/**
 * Paramètres pour la navigation principale (Root)
 */
export type RootStackParamList = {
  AppLoading: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

/**
 * Paramètres pour la navigation d'authentification
 */
export type AuthStackParamList = {
  Login: undefined;
};

/**
 * Paramètres pour la navigation de l'application (authentifiée)
 */
export type AppStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  TaskDetail: {
    taskId: string;
    openTab?: 'overview' | 'comments' | 'history' | 'attachments';
  };
  ActivityDetail: {
    eventId: string;
  };
  TagEditModal: {
    mode: 'create' | 'edit';
    tag?: SuiviTag; // présent en mode 'edit'
  };
};

/**
 * Paramètres pour la navigation par onglets (Main Tab Navigator)
 */
export type MainTabParamList = {
  Home: undefined;
  MyTasks: {
    initialFilter?: 'active' | 'completed';
  } | undefined;
  Notifications: undefined;
  More: undefined;
};


