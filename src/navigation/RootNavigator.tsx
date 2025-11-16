import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../auth';
import { AppLoadingScreen } from '../screens/AppLoadingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import type { RootStackParamList, AuthStackParamList, AppStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

/**
 * AuthNavigator
 * 
 * Stack de navigation pour les écrans d'authentification.
 * Accessible uniquement lorsque l'utilisateur n'est pas connecté.
 */
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
      />
    </AuthStack.Navigator>
  );
}

/**
 * AppNavigator
 * 
 * Stack de navigation pour l'application authentifiée.
 * Contient le MainTabNavigator et les écrans modaux (TaskDetail, etc.).
 */
function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen
        name="Main"
        component={MainTabNavigator}
      />
      <AppStack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
      />
    </AppStack.Navigator>
  );
}

/**
 * RootNavigator
 * 
 * Navigateur racine de l'application.
 * Gère la logique globale :
 * 1. AppLoading : Écran de chargement initial (restauration de session)
 * 2. Auth : Stack d'authentification (si non connecté)
 * 3. App : Stack principale de l'app (si connecté)
 */
export default function RootNavigator() {
  const { accessToken, isLoading } = useAuth();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isLoading ? (
        // Écran de chargement initial
        <RootStack.Screen
          name="AppLoading"
          component={AppLoadingScreen}
        />
      ) : !accessToken ? (
        // Stack d'authentification
        <RootStack.Screen
          name="Auth"
          component={AuthNavigator}
        />
      ) : (
        // Stack principale de l'app
        <RootStack.Screen
          name="App"
          component={AppNavigator}
        />
      )}
    </RootStack.Navigator>
  );
}


