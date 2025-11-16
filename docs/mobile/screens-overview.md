# Vue d'ensemble des écrans Mobile Suivi

## Introduction

Ce document liste tous les écrans de l'application mobile Suivi, leur rôle, leur navigation, et les données qu'ils consomment.

## Liste des écrans

| Screen | Route | Navigator | Description | Data principale | API future (endpoint/domain) |
|--------|-------|-----------|-------------|-----------------|------------------------------|
| **AppLoadingScreen** | `AppLoading` | `RootNavigator` | Écran de chargement initial (restauration de session) | None | None |
| **LoginScreen** | `Login` | `AuthNavigator` | Écran de connexion (email/password) | None | `/api/auth/login` |
| **HomeScreen** | `Home` | `MainTabNavigator` | Écran d'accueil | None (placeholder) | `/api/me/dashboard` (à confirmer) |
| **MyTasksScreen** | `MyTasks` | `MainTabNavigator` | Liste des tâches de l'utilisateur avec filtres | `Task[]` | `/api/me/tasks` |
| **TaskDetailScreen** | `TaskDetail` | `AppNavigator` (Stack) | Détails d'une tâche | `Task` | `/api/tasks/{id}` |
| **NotificationsScreen** | `Notifications` | `MainTabNavigator` | Liste des notifications | None (placeholder) | `/api/me/notifications` |
| **MoreScreen** | `More` | `MainTabNavigator` | Menu "Plus" (déconnexion, settings) | None | None |

## Détail par écran

### 0. AppLoadingScreen

**Fichier** : `/src/screens/AppLoadingScreen.tsx`

**Route** : `AppLoading` (dans `RootNavigator`)

**Navigator** : `RootNavigator` (Stack)

**Description** : Écran de chargement initial affiché pendant la restauration de session et l'initialisation de l'application.

**Fonctionnalités** :
- Logo/text "Suivi" stylisé avec la couleur primaire
- Sous-titre "Mobile"
- Indicateur de chargement (ActivityIndicator)
- Utilise le thème pour les couleurs (couleurs dynamiques)

**Data principale** : Aucune (écran de chargement)

**Source de données** : Aucune

**Navigation** :
- **Affiché automatiquement** : Quand `AuthProvider.isLoading === true`
- **Redirection automatique** : Une fois `isLoading === false` :
  - Si `accessToken` → Navigate vers `App` (MainTabNavigator)
  - Si `!accessToken` → Navigate vers `Auth` (LoginScreen)

**Dépendances** :
- `useTheme()` : Pour les couleurs dynamiques
- `Screen` : Wrapper pour le SafeAreaView et le padding

**Logique actuelle** :
- Affiché pendant le chargement du token depuis SecureStore dans `AuthProvider`
- Détecte automatiquement la fin du chargement via `isLoading` du Context

**Futur** :
- Peut être étendu pour charger d'autres données au démarrage (thème utilisateur, préférences, etc.)
- Logique de restauration de session plus complexe si nécessaire

---

### 1. LoginScreen

**Fichier** : `/src/screens/LoginScreen.tsx`

**Route** : `Login` (dans `AuthNavigator`)

**Navigator** : `AuthNavigator` (Stack)

**Description** : Écran de connexion où l'utilisateur saisit son email et son mot de passe pour se connecter.

**Fonctionnalités** :
- Champ Email (TextInput)
- Champ Password (TextInput avec secureTextEntry)
- Bouton "Sign In"
- Gestion des erreurs d'authentification
- État de chargement pendant la connexion

**Data principale** : Aucune (écran de formulaire)

**Source de données** : 
- **Actuel** : Mock (token généré localement dans `AuthProvider.signIn()`)
- **Futur** : API `/api/auth/login` (POST)

**Navigation** :
- **Succès** : `signIn()` met à jour `accessToken` → Navigation automatique vers `AppNavigator` (MainTabNavigator)
- **Erreur** : Affiche un message d'erreur (pas de navigation)

**Dépendances** :
- `useAuth()` : Pour appeler `signIn(email, password)`

---

### 2. HomeScreen

**Fichier** : `/src/screens/HomeScreen.tsx`

**Route** : `Home` (dans `MainTabNavigator`)

**Navigator** : `MainTabNavigator` (Bottom Tab)

**Description** : Écran d'accueil de l'application (placeholder actuellement).

**Fonctionnalités** :
- Titre "Home"
- Sous-titre "Welcome to Suivi"

**Data principale** : Aucune (placeholder)

**Source de données** :
- **Actuel** : Aucune
- **Futur** : API `/api/me/dashboard` ou similaire (à confirmer côté backend Suivi)
  - Statistiques utilisateur
  - Tâches récentes
  - Notifications non lues
  - Projets récents

**Navigation** : Aucune (écran d'accueil)

**Dépendances** : Aucune

---

### 3. MyTasksScreen

**Fichier** : `/src/screens/MyTasksScreen.tsx`

**Route** : `MyTasks` (dans `MainTabNavigator`)

**Navigator** : `MainTabNavigator` (Bottom Tab)

**Description** : Liste des tâches de l'utilisateur avec filtres (All, Open, Done) et pagination infinie.

**Fonctionnalités** :
- **Barre de filtres** : 3 boutons (All, Open, Done)
  - All : Toutes les tâches
  - Open : Tâches avec statut `todo`, `in_progress`, ou `blocked`
  - Done : Tâches avec statut `done`
- **FlatList** de tâches avec :
  - Titre de la tâche
  - Nom du projet (si présent)
  - Badge de statut (todo, in_progress, blocked, done)
  - Date d'échéance (si présente)
- **Pagination infinie** : Chargement automatique de plus de tâches en scrollant vers le bas
- **États de chargement** : Loading, Error, Empty

**Data principale** : 
```typescript
Task[] // Array de Task
```

**Type Task** :
```typescript
type Task = {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'blocked' | 'done';
  dueDate?: string | null;
  projectName?: string | null;
  assigneeName?: string | null;
  updatedAt?: string;
};
```

**Source de données** :
- **Actuel** : API mock via `/src/api/tasks.ts` → `getMyTasks(accessToken, params)`
- **Futur** : API `/api/me/tasks` (GET)
  - Query params : `page`, `pageSize`, `status` (optionnel)

**Navigation** :
- **Item press** : Navigue vers `TaskDetail` avec `{ taskId: item.id }`

**Dépendances** :
- `useMyTasks({ filters })` : Hook React Query pour récupérer les tâches avec pagination infinie
- `useAuth()` : Pour obtenir `accessToken`

**Hook utilisé** :
```typescript
const {
  tasks,
  isLoading,
  isError,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useMyTasks({ filters });
```

---

### 4. TaskDetailScreen

**Fichier** : `/src/screens/TaskDetailScreen.tsx`

**Route** : `TaskDetail` (dans `AppNavigator` Stack)

**Navigator** : `AppNavigator` (Stack modal)

**Description** : Affichage détaillé d'une tâche avec toutes ses informations.

**Fonctionnalités** :
- **Titre** : Titre de la tâche
- **Badge de statut** : Statut avec couleur (todo, in_progress, blocked, done)
- **Informations** :
  - Projet (si présent)
  - Assigné à (si présent)
  - Date d'échéance (si présente)
  - Date de mise à jour (si présente)
- **États de chargement** : Loading, Error

**Paramètres de route** :
```typescript
{
  taskId: string; // ID de la tâche à afficher
}
```

**Data principale** :
```typescript
Task // Single Task object
```

**Source de données** :
- **Actuel** : API mock via `/src/api/tasks.ts` → `getTaskById(accessToken, taskId)`
- **Futur** : API `/api/tasks/{id}` (GET)

**Navigation** :
- **Back button** : Retour à l'écran précédent (`navigation.goBack()`)

**Dépendances** :
- `useQuery(['task', taskId])` : Hook React Query pour récupérer la tâche
- `useAuth()` : Pour obtenir `accessToken`
- `useRoute()` : Pour obtenir `taskId` depuis les paramètres de route

**Hook utilisé** :
```typescript
const {
  data: task,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ['task', taskId],
  queryFn: () => getTaskById(accessToken, taskId),
  enabled: !!accessToken,
});
```

---

### 5. NotificationsScreen

**Fichier** : `/src/screens/NotificationsScreen.tsx`

**Route** : `Notifications` (dans `MainTabNavigator`)

**Navigator** : `MainTabNavigator` (Bottom Tab)

**Description** : Liste des notifications de l'utilisateur (placeholder actuellement).

**Fonctionnalités** :
- Titre "Notifications"
- Message "No new notifications"

**Data principale** : Aucune (placeholder)

**Source de données** :
- **Actuel** : Aucune
- **Futur** : API `/api/me/notifications` (GET)
  - Query params : `page`, `pageSize`, `read` (optionnel)

**Type Notification attendu** (à confirmer) :
```typescript
type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'project' | 'mention' | 'system';
  read: boolean;
  createdAt: string;
  link?: string; // ID de la ressource (task, project, etc.)
};
```

**Navigation** : Aucune actuellement

**Dépendances** : Aucune actuellement

**À implémenter** :
- Hook `useNotifications()` avec React Query
- API `/src/api/notifications.ts` avec `getNotifications(accessToken, params)`
- Liste de notifications avec pagination
- Marquage comme lu/non lu
- Navigation vers la ressource liée (task, project, etc.)

---

### 6. MoreScreen

**Fichier** : `/src/screens/MoreScreen.tsx`

**Route** : `More` (dans `MainTabNavigator`)

**Navigator** : `MainTabNavigator` (Bottom Tab)

**Description** : Menu "Plus" avec options supplémentaires (déconnexion, settings, etc.).

**Fonctionnalités** :
- Titre "More"
- Bouton "Sign Out" pour déconnecter l'utilisateur

**Data principale** : Aucune

**Source de données** : Aucune

**Navigation** :
- **Sign Out** : Appelle `signOut()` → Navigation automatique vers `AuthNavigator` (LoginScreen)

**Dépendances** :
- `useAuth()` : Pour appeler `signOut()`

**À implémenter** :
- Section Settings (profil utilisateur, préférences)
- Section About (version de l'app, liens)
- Liens vers d'autres écrans (Projects, Users, etc.)

---

## Navigation flow

### 1. Utilisateur non authentifié

```
App démarre
  ↓
RootNavigator vérifie accessToken
  ↓
Si !accessToken → AuthNavigator
  ↓
LoginScreen
```

### 2. Utilisateur authentifié

```
App démarre
  ↓
RootNavigator vérifie accessToken
  ↓
Si accessToken → AppNavigator
  ↓
MainTabNavigator (onglets)
  ├─ Home (HomeScreen)
  ├─ Tasks (MyTasksScreen)
  │    ↓ (item press)
  │    TaskDetailScreen
  ├─ Notifications (NotificationsScreen)
  └─ More (MoreScreen)
       ↓ (sign out)
       AuthNavigator → LoginScreen
```

## Pattern de récupération de données

### 1. Hooks React Query

Tous les écrans qui consomment des données utilisent des hooks React Query :

- `useMyTasks()` : Pour la liste des tâches (pagination infinie)
- `useQuery(['task', taskId])` : Pour les détails d'une tâche

**Pattern** :
```typescript
// Dans l'écran
const { data, isLoading, isError } = useMyData();

if (isLoading) return <LoadingState />;
if (isError) return <ErrorState />;
return <SuccessState data={data} />;
```

### 2. API Client

Tous les appels API passent par `/src/api/client.ts` (`apiFetch`) :

```typescript
// Dans /src/api/tasks.ts
export async function getMyTasks(
  accessToken: string,
  params: { page?: number; pageSize?: number; filters?: MyTasksFilters } = {},
): Promise<MyTasksPage> {
  const path = `/me/tasks?${searchParams.toString()}`;
  return apiFetch<MyTasksPage>(path, {}, accessToken);
}
```

## États de chargement

Tous les écrans qui chargent des données gèrent les états suivants :

1. **Loading** : Affiche un `ActivityIndicator` ou un message "Loading..."
2. **Error** : Affiche un message d'erreur en rouge
3. **Empty** : Affiche un message "No data" (si applicable)
4. **Success** : Affiche les données

## Gestion des erreurs

### 1. Erreurs d'authentification

- **401 Unauthorized** : Déconnecter l'utilisateur et rediriger vers LoginScreen
- **403 Forbidden** : Afficher un message d'erreur

### 2. Erreurs réseau

- **Pas de connexion** : Afficher un message d'erreur avec possibilité de retry
- **Timeout** : Afficher un message d'erreur avec possibilité de retry

### 3. Erreurs de validation

- **400 Bad Request** : Afficher le message d'erreur du serveur
- **422 Unprocessable Entity** : Afficher les erreurs de validation

## Ajout d'un nouvel écran

### 1. Créer le fichier de l'écran

```typescript
// /src/screens/NewScreen.tsx
import React from 'react';
import { Screen } from '../components/Screen';

export function NewScreen() {
  return (
    <Screen>
      {/* Contenu */}
    </Screen>
  );
}
```

### 2. Ajouter la route

**Si dans MainTabNavigator** :
```typescript
// Dans /src/navigation/MainTabNavigator.tsx
import { NewScreen } from '../screens/NewScreen';

<Tab.Screen
  name="NewScreen"
  component={NewScreen}
  options={{
    tabBarLabel: 'New',
  }}
/>
```

**Si dans AppNavigator Stack** :
```typescript
// Dans /navigation/RootNavigator.tsx
import { NewScreen } from '../src/screens/NewScreen';

<Stack.Screen
  name="NewScreen"
  component={NewScreen}
/>
```

### 3. Ajouter la navigation (si nécessaire)

```typescript
navigation.navigate('NewScreen', { param1: value1 });
```

