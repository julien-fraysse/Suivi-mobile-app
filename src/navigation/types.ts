/**
 * Navigation Types
 * 
 * Types TypeScript pour toutes les routes de navigation de l'application.
 * Utilisés pour sécuriser la navigation et éviter les erreurs de typage.
 */

import { NavigatorScreenParams } from '@react-navigation/native';

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
  };
};

/**
 * Paramètres pour la navigation par onglets (Main Tab Navigator)
 */
export type MainTabParamList = {
  Home: undefined;
  MyTasks: {
    initialFilter?: 'all' | 'active' | 'completed';
  } | undefined;
  Notifications: undefined;
  More: undefined;
};


