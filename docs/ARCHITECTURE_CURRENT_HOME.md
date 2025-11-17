# Architecture Actuelle - Home Screen et Modals

## Vue d'ensemble

Ce document décrit l'architecture actuelle de l'écran Home et des modals dans l'application Suivi Mobile. Il sert de référence pour comprendre la structure existante avant d'ajouter de nouvelles fonctionnalités.

**Date de création :** 2024-11-16  
**Dernière mise à jour :** 2024-11-16

---

## 1. Structure des Écrans

### 1.1 Navigation Hiérarchique

```
RootNavigator (Stack)
├── AppLoading (écran de chargement initial)
├── Auth (Stack)
│   └── Login
└── App (Stack)
    ├── Main (Bottom Tab Navigator)
    │   ├── Home
    │   ├── MyTasks
    │   ├── Notifications
    │   └── More
    └── TaskDetail (modal stack)
```

### 1.2 HomeScreen (`src/screens/HomeScreen.tsx`)

**Structure :**
- **Wrapper :** `<Screen>` (composant de layout standardisé)
- **Header :** `<AppHeader />` (barre d'en-tête avec avatar utilisateur)
- **Search Bar :** `<HomeSearchBar />` (barre de recherche)
- **ScrollView :** Contenu scrollable avec 3 sections principales

**Sections :**

1. **"What's new"** - Statistiques rapides
   - `StatCard` pour "Active Tasks" (compteur calculé depuis `useTasks`)
   - `StatCard` pour "Due Today" (compteur calculé depuis `useTasks`)
   - Navigation vers `MyTasks` avec filtres appropriés

2. **"Recent Activity"** - Fil d'activité
   - Utilise `useActivityFeed(5)` pour récupérer les 5 dernières activités
   - États gérés : `isLoading`, `isError`, `error`
   - Affichage conditionnel :
     - Skeleton loading (3 cartes)
     - Message d'erreur avec bouton "Retry"
     - Liste des activités (cartes `SuiviCard`)
     - Message "No recent activity" si vide

3. **"Actions"** - Boutons d'action
   - `SuiviButton` "Quick Capture" → ouvre `QuickCaptureModal`
   - `SuiviButton` "View All Tasks" → navigation vers `MyTasks`

**Modals :**
- `<QuickCaptureModal />` - Modal pour capture rapide de tâches

---

## 2. Principaux Composants UI

### 2.1 Composants de Layout

#### `Screen` (`src/components/Screen.tsx`)
- Wrapper standardisé pour tous les écrans
- Props : `padding`, `scrollable`, `style`, `contentContainerStyle`
- Utilise `ScreenContainer` avec `SafeAreaView`

#### `AppHeader` (`src/components/AppHeader.tsx`)
- Barre d'en-tête avec avatar utilisateur
- Props : `showBackButton`, `onBack`
- Utilise `useUserProfile()` pour l'avatar

### 2.2 Composants Spécifiques Home

#### `HomeSearchBar` (`src/components/HomeSearchBar.tsx`)
- Barre de recherche pill-shaped (borderRadius full)
- Props : `onSearch?: (query: string) => void`
- Style adapté au thème (light/dark mode)
- **État actuel :** Log uniquement (prêt pour intégration API future)

#### `StatCard` (`src/components/ui/StatCard.tsx`)
- Carte de statistique avec couleur personnalisable
- Props : `title`, `value`, `color` ('primary' | 'accent' | 'success' | 'error'), `onPress`
- Design : Background coloré, texte inverse (blanc), radius xl, shadow card

### 2.3 Composants UI Réutilisables

#### `SuiviCard` (`src/components/ui/SuiviCard.tsx`)
- Carte avec padding, elevation, variant
- Props : `padding`, `elevation`, `variant` ('default' | 'outlined')

#### `SuiviButton` (`src/components/ui/SuiviButton.tsx`)
- Bouton avec variants : 'primary', 'ghost', etc.
- Props : `title`, `onPress`, `variant`, `fullWidth`, `disabled`, `loading`

#### `SuiviText` (`src/components/ui/SuiviText.tsx`)
- Texte typographié avec variants : 'h1', 'h2', 'body', 'label', 'mono'
- Props : `variant`, `color` ('primary' | 'secondary' | 'inverse')

---

## 3. Pattern de Navigation

### 3.1 Navigation Stack

**Bibliothèque :** `@react-navigation/native-stack` et `@react-navigation/bottom-tabs`

**Structure :**
- **RootStack :** Gère AppLoading / Auth / App
- **AuthStack :** Gère Login
- **AppStack :** Gère Main (tabs) + TaskDetail (modal)
- **MainTabNavigator :** Bottom tabs avec 4 écrans

### 3.2 Navigation depuis HomeScreen

**Pattern utilisé :**
```typescript
const navigation = useNavigation<HomeNavigationProp>();

// Navigation vers MyTasks avec filtre
navigation.navigate('Main', { 
  screen: 'MyTasks', 
  params: { initialFilter: 'active' } 
});
```

**Types de navigation :**
- **Inter-tab :** `navigation.navigate('Main', { screen: 'MyTasks', params: {...} })`
- **Stack modal :** `navigation.navigate('TaskDetail', { taskId: '...' })`

### 3.3 Types TypeScript

**Fichier :** `src/navigation/types.ts`

- `RootStackParamList` - Routes racine
- `AuthStackParamList` - Routes auth
- `AppStackParamList` - Routes app (Main + TaskDetail)
- `MainTabParamList` - Routes des tabs

---

## 4. Gestion des Données Mockées

### 4.1 Architecture des Données

**Pattern :** Double couche API + Mocks

1. **Couche API** (`src/api/`) - Interface abstraite
   - `activity.ts` - API activité
   - `tasks.ts` - API tâches
   - `client.ts` - Client HTTP avec `apiFetch()`

2. **Couche Mocks** (`src/api/*.mock.ts` et `src/mocks/data/`)
   - `tasksApi.mock.ts` - Mocks pour tâches
   - `activity.ts` (dans mocks/data) - Mocks pour activité
   - `notificationsApi.mock.ts` - Mocks pour notifications

### 4.2 Configuration Mock

**Fichier :** `src/config/environment.ts`

```typescript
export const USE_MOCK_API = true; // Basculer entre mock et vrai API
```

**Pattern dans les APIs :**
```typescript
export async function getActivityFeed(limit: number, _accessToken?: string) {
  if (USE_MOCK_API) {
    return mockActivity.getActivityFeed(limit);
  }
  // Appel API réel
  return apiFetch<ActivityItem[]>(path, {}, _accessToken);
}
```

### 4.3 Hooks de Données

#### `useTasks` (`src/tasks/useTasks.ts`)
- **Source :** `TasksContext` (contexte React)
- **Filtres :** 'all', 'active', 'completed', ou `TaskStatus`
- **Retourne :** `{ tasks, isLoading, error, refresh }`

#### `useActivityFeed` (`src/hooks/useActivity.ts`)
- **Source :** React Query (`@tanstack/react-query`)
- **API :** `activityAPI.getActivityFeed(limit, accessToken)`
- **Retourne :** `{ data, isLoading, isError, error, refetch }`
- **Cache :** Géré par React Query (queryKey: `['activity', 'feed', limit]`)

#### `useTasksContext` (`src/contexts/TasksContext.tsx`)
- **Provider :** `TasksProvider` (wrap dans `App.tsx`)
- **Méthodes :** `updateTaskStatus`, `refreshTasks`
- **État :** `tasks`, `isLoading`, `error`

### 4.4 Gestion d'État

**Deux systèmes coexistent :**

1. **React Context** (`TasksContext`)
   - Pour les tâches (source unique de vérité)
   - Synchronisation entre écrans
   - Méthodes : `updateTaskStatus`, `refreshTasks`

2. **React Query** (`@tanstack/react-query`)
   - Pour l'activité (`useActivityFeed`)
   - Cache automatique, refetch, invalidation
   - Query keys : `['activity', 'feed', limit]`

---

## 5. Modals

### 5.1 QuickCaptureModal

**Fichier :** `src/components/ui/QuickCaptureModal.tsx`

**Caractéristiques :**
- Modal React Native (`Modal` component)
- Animation : fade + scale (Animated API)
- Design : Container arrondi 24px, shadow card
- Input : Multiline autosizing (max 3-4 lignes)
- Actions : "Send to Suivi" (primary) + "Cancel" (outlined)
- Tap outside to close
- Reset form après submit

**Props :**
- `visible: boolean`
- `onClose: () => void`
- `onSuccess?: () => void`

**Logique :**
- Utilise `quickCapture()` depuis `tasksApi.mock.ts`
- Rafraîchit `TasksContext` après création
- Appelle `onSuccess()` pour rafraîchir l'activité dans HomeScreen

**État :**
- `text` - Contenu de l'input
- `isLoading` - État de chargement
- `inputRef` - Référence pour focus automatique

---

## 6. Patterns et Conventions

### 6.1 Gestion des États de Chargement

**Pattern utilisé :**
```typescript
{isLoading ? (
  <SkeletonComponent />
) : isError ? (
  <ErrorComponent onRetry={refetch} />
) : data && data.length > 0 ? (
  <DataListComponent data={data} />
) : (
  <EmptyStateComponent />
)}
```

### 6.2 Formatage des Dates

**Fonction utilitaire dans HomeScreen :**
```typescript
function formatActivityDate(dateString: string): string {
  // Format relatif : "Just now", "5m ago", "2h ago", "3d ago"
  // Format absolu si > 7 jours : "Nov 15"
}
```

### 6.3 Calcul des Statistiques

**Pattern :**
```typescript
const activeCount = useMemo(() => {
  return allTasks.filter((t) => t.status !== 'done').length;
}, [allTasks]);
```

**Source :** `useTasks('all')` retourne toutes les tâches, puis filtrage local avec `useMemo`.

---

## 7. Points d'Attention pour Futures Modifications

### 7.1 Ajout de "Recent Activity" Amélioré

**Considérations :**
- Le hook `useActivityFeed` est déjà utilisé dans HomeScreen
- Les données viennent de `activityAPI.getActivityFeed()` (mock ou API)
- Le cache React Query gère automatiquement le rafraîchissement
- Pour ajouter plus de fonctionnalités :
  - Étendre le type `ActivityItem` si nécessaire
  - Ajouter des filtres dans `getActivityFeed()` si besoin
  - Utiliser `refetch()` pour forcer le rafraîchissement

### 7.2 Synchronisation des Données

**Actuel :**
- Tâches : `TasksContext` (synchronisé entre écrans)
- Activité : React Query (cache indépendant)

**Pour synchroniser :**
- Utiliser `queryClient.invalidateQueries()` après modification de tâche
- Ou appeler `refetch()` manuellement dans les callbacks

### 7.3 Navigation

**Pattern à suivre :**
- Toujours utiliser les types TypeScript (`AppStackParamList`, etc.)
- Navigation inter-tab : `navigation.navigate('Main', { screen: '...', params: {...} })`
- Navigation stack : `navigation.navigate('TaskDetail', { taskId: '...' })`

---

## 8. Fichiers Clés

### Écrans
- `src/screens/HomeScreen.tsx` - Écran principal Home

### Composants
- `src/components/AppHeader.tsx` - Header avec avatar
- `src/components/HomeSearchBar.tsx` - Barre de recherche
- `src/components/ui/StatCard.tsx` - Carte de statistique
- `src/components/ui/QuickCaptureModal.tsx` - Modal capture rapide

### Navigation
- `src/navigation/RootNavigator.tsx` - Navigateur racine
- `src/navigation/MainTabNavigator.tsx` - Bottom tabs
- `src/navigation/types.ts` - Types TypeScript

### Données
- `src/api/activity.ts` - API activité
- `src/api/tasks.ts` - API tâches
- `src/hooks/useActivity.ts` - Hook activité
- `src/tasks/useTasks.ts` - Hook tâches
- `src/contexts/TasksContext.tsx` - Contexte tâches

### Configuration
- `src/config/environment.ts` - Configuration (USE_MOCK_API)

---

## 9. Notes Techniques

### 9.1 Thème et Tokens

- Tous les composants utilisent `tokens` depuis `src/theme/tokens.ts`
- Support light/dark mode via `useTheme()` de `react-native-paper`
- Tokens Suivi : `tokens.colors.brand.primary`, `tokens.spacing.*`, etc.

### 9.2 Gestion d'Erreurs

- React Query gère automatiquement les erreurs pour `useActivityFeed`
- `TasksContext` expose `error` pour les tâches
- Affichage conditionnel avec messages d'erreur et boutons "Retry"

### 9.3 Performance

- `useMemo` pour les calculs de statistiques
- React Query cache pour éviter les requêtes inutiles
- Skeleton loading pour améliorer l'UX pendant le chargement

---

## Conclusion

L'architecture actuelle est bien structurée avec :
- Séparation claire entre UI, navigation, et données
- Double couche API/Mocks pour faciliter le développement
- Hooks réutilisables et contexte pour la synchronisation
- Types TypeScript pour la sécurité de navigation

Pour ajouter "Recent Activity" amélioré, il suffit d'étendre le hook `useActivityFeed` et les composants d'affichage existants sans casser l'architecture actuelle.

