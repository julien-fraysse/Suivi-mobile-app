import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@store/authStore';
import { AppLoadingScreen } from '@screens/AppLoadingScreen';
import { LoginScreen } from '@screens/LoginScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { TaskDetailScreen } from '@screens/TaskDetailScreen';
import { ActivityDetailScreen } from '@screens/ActivityDetailScreen';
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
      <AppStack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{
          headerShown: true,
          title: '',
          headerBackTitle: '',
        }}
      />
    </AppStack.Navigator>
  );
}

/**
 * RootNavigator
 * 
 * Navigateur racine de l'application.
 * Gère la logique globale :
 * 1. Auth : Stack d'authentification (si non connecté)
 * 2. App : Stack principale de l'app (si connecté)
 * 
 * Note: Le chargement initial est géré dans App.tsx
 */
export default function RootNavigator() {
  const user = useAuthStore((s) => s.user);

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
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


