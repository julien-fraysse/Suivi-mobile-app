# Architecture de l'Application Mobile Suivi

## Introduction

L'application mobile Suivi est construite avec **React Native** et **Expo SDK 54**, en utilisant **TypeScript** et **React Navigation** pour la gestion de la navigation. Le design system est basé sur **Material Design 3** via **React Native Paper**, avec des tokens de design personnalisés pour les couleurs de la marque Suivi.

## Vue d'ensemble de l'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      App.tsx (Root Entry)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         QueryClientProvider (@tanstack/react-query)     │ │
│  │  ┌────────────────────────────────────────────────────┐│ │
│  │  │              AuthProvider (Context)                ││ │
│  │  │  ┌──────────────────────────────────────────────┐ ││ │
│  │  │  │      ThemeProvider (Theme + PaperProvider)    ││ │
│  │  │  │  ┌────────────────────────────────────────┐ ││ │
│  │  │  │  │    NavigationContainer (React Nav)     ││ │
│  │  │  │  │  ┌──────────────────────────────────┐ ││ │
│  │  │  │  │  │      RootNavigator              ││ │
│  │  │  │  │  │  ├─ AuthNavigator (si non auth) ││ │
│  │  │  │  │  │  └─ AppNavigator (si auth)      ││ │
│  │  │  │  │  │     ├─ MainTabNavigator         ││ │
│  │  │  │  │  │     │  ├─ HomeScreen            ││ │
│  │  │  │  │  │     │  ├─ MyTasksScreen         ││ │
│  │  │  │  │  │     │  ├─ NotificationsScreen   ││ │
│  │  │  │  │  │     │  └─ MoreScreen            ││ │
│  │  │  │  │  │     └─ TaskDetailScreen         ││ │
│  │  │  │  │  └──────────────────────────────────┘ ││ │
│  │  │  │  └────────────────────────────────────────┘ ││ │
│  │  │  └──────────────────────────────────────────────┘ ││ │
│  │  └────────────────────────────────────────────────────┘│ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

Data Flow:
┌──────────┐
│  Screens │  ──►  useHooks (React Query)  ──►  API Client  ──►  Backend
└──────────┘                  │
                              ▼
                        QueryClient Cache
```

## Arborescence principale du projet

```
Suivi-mobile-app/
├── App.tsx                          # Point d'entrée root (proxy vers src/App.tsx)
├── src/
│   ├── App.tsx                      # Composant principal avec providers
│   ├── api/                         # Couche API (client HTTP + endpoints)
│   │   ├── client.ts                # Client HTTP générique (apiFetch)
│   │   ├── tasks.ts                 # API tâches (getTasks, getTaskById, etc.)
│   │   ├── notifications.ts         # API notifications
│   │   ├── activity.ts              # API activités
│   │   └── index.ts                 # Exports API
│   ├── auth/                        # Authentification
│   │   ├── AuthContext.tsx          # Context et hook useAuth
│   │   ├── AuthProvider.tsx         # Provider d'authentification
│   │   └── index.ts                 # Exports auth
│   ├── components/                  # Composants UI réutilisables
│   │   ├── Screen.tsx               # Wrapper de screen avec SafeAreaView
│   │   ├── HomeSearchBar.tsx        # Barre de recherche (composant de présentation)
│   │   ├── AppHeader.tsx            # Header de l'application
│   │   ├── activity/                # Composants activité (ActivityCard, etc.)
│   │   ├── home/                    # Composants Home (AIDailyPulseCard, DailyKPIs)
│   │   ├── layout/                  # Layout (ScreenContainer, ScreenHeader)
│   │   ├── tasks/                   # Composants tâches (TaskItem, QuickActions)
│   │   └── ui/                      # UI Kit Suivi (SuiviButton, SuiviCard, SuiviText, etc.)
│   ├── config/                      # Configuration
│   │   └── apiMode.ts               # Mode API (mock | api)
│   ├── features/                    # Features isolées (architecture feature-based)
│   │   ├── search/                  # 🔍 Moteur de recherche unifié
│   │   │   ├── searchTypes.ts       # Types SearchResult, SearchStatus
│   │   │   ├── searchService.ts     # Service mock + API-ready
│   │   │   ├── searchStore.ts       # Store Zustand isolé
│   │   │   └── searchSelectors.ts   # Sélecteurs optimisés
│   │   ├── tasks/                   # Feature tâches
│   │   │   ├── taskStore.ts         # Store tâches (hook-based)
│   │   │   └── taskFilters.ts       # Logique de filtrage
│   │   └── notifications/           # Feature notifications
│   │       └── notificationsStore.tsx
│   ├── hooks/                       # Hooks React Query et custom
│   │   ├── useMyTasks.ts            # Hook React Query pour les tâches
│   │   ├── useActivity.ts           # Hook pour le flux d'activité
│   │   ├── useNotifications.ts      # Hook pour les notifications
│   │   └── queries/                 # Hooks React Query spécifiques
│   ├── i18n/                        # Internationalisation
│   │   ├── index.ts                 # Configuration i18next
│   │   └── resources/               # Fichiers de traduction
│   │       ├── fr.json              # Traductions françaises
│   │       └── en.json              # Traductions anglaises
│   ├── mocks/                       # Données mockées (MVP)
│   │   ├── backend/                 # Mock backend centralisé
│   │   │   ├── store.ts             # Store en mémoire (TASKS_STORE, etc.)
│   │   │   ├── handlers.ts          # Handlers mock (CRUD)
│   │   │   ├── errors.ts            # Gestion d'erreurs API
│   │   │   └── index.ts             # Exports
│   │   ├── suiviData.ts             # Données centralisées (TASKS, NOTIFICATIONS)
│   │   ├── tasksMock.ts             # Mocks tâches
│   │   ├── notificationsMock.ts     # Mocks notifications
│   │   └── projectsMock.ts          # Mocks projets
│   ├── navigation/                  # Navigation React Navigation
│   │   ├── RootNavigator.tsx        # Navigateur racine (AppLoading, Auth, App)
│   │   ├── MainTabNavigator.tsx     # Bottom Tab Navigator
│   │   └── types.ts                 # Types TypeScript pour les routes
│   ├── screens/                     # Écrans de l'application
│   │   ├── AppLoadingScreen.tsx     # Écran de chargement initial
│   │   ├── HomeScreen.tsx           # Écran d'accueil (AI Pulse, Activity, Search)
│   │   ├── LoginScreen.tsx          # Écran de connexion
│   │   ├── MyTasksScreen.tsx        # Liste des tâches utilisateur
│   │   ├── TaskDetailScreen.tsx     # Détails d'une tâche
│   │   ├── NotificationsScreen.tsx  # Notifications
│   │   ├── MoreScreen.tsx           # Menu "Plus" (profil, settings)
│   │   └── ActivityDetailScreen.tsx # Détails d'une activité
│   ├── services/                    # Services (legacy, en migration vers api/)
│   │   └── tasksService.ts          # Service tâches (deprecated)
│   ├── store/                       # Stores Zustand globaux
│   │   ├── authStore.ts             # État d'authentification (user, isLoading)
│   │   ├── preferencesStore.ts      # Préférences utilisateur (themeMode)
│   │   ├── uiStore.ts               # État UI (quickCaptureOpen)
│   │   ├── tagsStore.ts             # Store des tags
│   │   └── index.ts                 # Exports
│   ├── theme/                       # Thème et design system
│   │   ├── ThemeProvider.tsx        # Provider thème (light/dark/auto)
│   │   ├── tokens.ts                # Design tokens (colors, spacing, etc.)
│   │   ├── fonts.ts                 # Configuration des polices
│   │   └── index.ts                 # Exports
│   └── types/                       # Types TypeScript centralisés
│       ├── task.ts                  # Type Task normalisé
│       ├── activity.ts              # Types activité
│       └── index.ts                 # Exports
├── theme/                           # Thème racine (exports)
│   └── index.ts                     # Re-export de src/theme
└── package.json                     # Dépendances et scripts
```

## Responsabilités par dossier

### `/src/config/`
**Rôle** : Configuration globale de l'application.

- `apiMode.ts` : Contrôle le mode de fonctionnement (mock ou API réelle)
  ```typescript
  export type ApiMode = 'mock' | 'api';
  export const API_MODE: ApiMode = 'mock'; // Par défaut : mode mock
  ```

**Comportement** :
- **Mode `mock`** : Les services utilisent les données de `/src/mocks/`, hooks React Query désactivés
- **Mode `api`** : Les services appellent les vrais endpoints, hooks React Query actifs

---

### `/src/api/`
**Rôle** : Couche d'abstraction pour les appels HTTP vers le backend Suivi.

- `client.ts` : Fonction générique `apiFetch<T>()` qui gère :
  - Construction de l'URL (API_BASE_URL + path)
  - Headers (Authorization Bearer token, Content-Type)
  - Gestion d'erreurs HTTP
- `tasks.ts` : Fonctions API tâches (respecte `API_MODE`) :
  - `getTasks()`, `getTaskById()`, `createTask()`, `updateTask()`, `deleteTask()`
- `notifications.ts` : Fonctions API notifications
- `activity.ts` : Fonctions API activités

**Point de connexion API** : C'est ici que toutes les fonctions API sont définies. Elles respectent `API_MODE` pour basculer entre mock et API réelle.

### `/src/auth/`
**Rôle** : Gestion de l'authentification et de la session utilisateur.

- `AuthContext.tsx` : Définit le type `AuthContextValue` et le hook `useAuth()`
- `AuthProvider.tsx` : 
  - Stocke le token dans `SecureStore` (expo-secure-store)
  - Gère l'état `accessToken` et `isLoading`
  - Fournit `signIn()` et `signOut()`
  - **Actuellement mocké** : `signIn()` génère un token mock

**Point de connexion API** : La fonction `signIn()` dans `AuthProvider.tsx` doit être remplacée par un appel réel à `/api/auth/login` ou équivalent.

### `/src/store/`
**Rôle** : Stores Zustand pour la gestion d'état global.

**Stores disponibles** :
- `authStore.ts` : État d'authentification (user, isLoading) — **INTERDIT de modifier**
- `preferencesStore.ts` : Préférences utilisateur (themeMode)
- `uiStore.ts` : État UI (quickCaptureOpen)
- `tagsStore.ts` : Gestion des tags

**Règles Zustand** :
```typescript
// ✅ Correct : utiliser des sélecteurs
const user = useAuthStore((s) => s.user);
const isLoading = useAuthStore((s) => s.isLoading);

// ❌ Interdit : accès direct au store
const { user, isLoading } = useAuthStore(); // Re-render sur tout changement
```

**Pattern** : Chaque store expose des sélecteurs atomiques pour éviter les re-renders inutiles.

---

### `/src/features/`
**Rôle** : Features isolées avec architecture modulaire (types, service, store, sélecteurs).

**Features disponibles** :
- `search/` : Moteur de recherche unifié (voir section dédiée)
- `tasks/` : Gestion des tâches (taskStore, taskFilters)
- `notifications/` : Gestion des notifications

**Structure d'une feature** :
```
src/features/{feature}/
├── {feature}Types.ts      # Types TypeScript
├── {feature}Service.ts    # Service mock + API-ready
├── {feature}Store.ts      # Store Zustand isolé
└── {feature}Selectors.ts  # Sélecteurs optimisés
```

**Pattern** : Chaque feature est autonome et peut être testée indépendamment. Les écrans utilisent les sélecteurs, pas les stores directement.

---

### `/src/hooks/`
**Rôle** : Hooks React Query pour récupérer et gérer les données côté client.

- `useMyTasks.ts` : Hook `useInfiniteQuery` pour la pagination des tâches
- `useActivity.ts` : Hook pour le flux d'activité
- `useNotifications.ts` : Hook pour les notifications
- `queries/` : Hooks React Query spécifiques par domaine

**Pattern** : Créer un hook par domaine qui encapsule la logique React Query. Les hooks respectent `API_MODE` via `enabled: API_MODE === 'api'`.

### `/src/screens/`
**Rôle** : Composants d'écran (UI uniquement).

- Chaque écran utilise les hooks appropriés pour récupérer les données
- Affiche les états de chargement, erreur, et succès
- Utilise le composant `Screen` wrapper pour le layout
- Utilise le thème via `useTheme()` de React Native Paper

### `/src/navigation/`
**Rôle** : Configuration de la navigation React Navigation.

- `RootNavigator.tsx` : Navigation racine qui gère :
  - `AppLoading` : Écran de chargement initial (pendant la restauration de session)
  - `Auth` : Stack d'authentification (si non connecté)
  - `App` : Stack principale (si connecté)
- `MainTabNavigator.tsx` : Bottom Tab Navigator avec 4 onglets (Home, Tasks, Notifications, More)
  - Utilise MaterialCommunityIcons pour les icônes
  - Typé avec `MainTabParamList`
- `types.ts` : Types TypeScript centralisés pour toutes les routes
  - `RootStackParamList`, `AuthStackParamList`, `AppStackParamList`, `MainTabParamList`
  - Utilisés pour sécuriser la navigation et éviter les erreurs de typage

### `/src/mocks/backend/`
**Rôle** : Mock backend centralisé pour le MVP.

**Structure** :
- `store.ts` : Stores en mémoire (`TASKS_STORE`, `ACTIVITIES_STORE`)
  - `getTasksStore()`, `setTasksStore()`, `updateTaskInStore()`, `deleteTaskFromStore()`
- `handlers.ts` : Handlers CRUD qui simulent les réponses API
  - `handleGetTasks()`, `handleGetTaskById()`, `handleCreateTask()`, `handleUpdateTask()`, `handleDeleteTask()`
- `errors.ts` : Classe `ApiError` pour simuler les erreurs HTTP
- `index.ts` : Exports centralisés

**Principe** : Le mock backend simule le comportement de l'API réelle. Les fonctions dans `/src/api/` appellent ces handlers quand `API_MODE === 'mock'`.

---

### `/theme/` et `/src/theme/`
**Rôle** : Design system centralisé avec tous les tokens de design et gestion du thème.

**`/theme/`** :
- `tokens.ts` : Tokens bruts centralisés pour :
  - **Couleurs** : `colors.brand` (primary, secondary, accent), `colors.text`, `colors.surface`, `colors.border`, etc.
  - **Spacing** : `spacing` (xs, sm, md, lg, xl, xxl, xxxl) - base unit 4px
  - **Radius** : `radius` (xs, sm, md, lg, xl, round)
  - **Typography** : `typography` (h1-h6, body1/body2, caption, button, etc.) avec fontSize, lineHeight, fontWeight
  - **Shadows** : `shadows` (level0 à level5) pour Material Design 3 elevation
  - **Elevation** : `elevation` (level0 à level5)
  - **Animation** : `animation` (fast, normal, slow) - durées en ms
  - **Z-Index** : `zIndex` (dropdown, sticky, fixed, modal, etc.)
- `paper-theme.ts` : Application des tokens au thème React Native Paper (light/dark)
  - `suiviLightTheme` : Thème clair basé sur MD3LightTheme + tokens Suivi
  - `suiviDarkTheme` : Thème sombre basé sur MD3DarkTheme + tokens Suivi
  - `suiviFonts` : Mapping des variantes MD3 (`bodySmall`, `titleLarge`, etc.) vers les poids de police
- `index.ts` : Export centralisé de tous les tokens, thèmes, et ThemeProvider

**`/src/theme/`** :
- `ThemeProvider.tsx` : Provider central pour gérer le thème de l'application
  - Encapsule `PaperProvider` de React Native Paper
  - Gère le mode de thème : `'light'`, `'dark'`, ou `'auto'` (suit le mode système)
  - Utilise `useColorScheme()` de React Native pour détecter le mode système
  - Expose `useThemeMode()` hook pour accéder au contexte et changer le mode
  - Intégré dans `App.tsx` au niveau racine

**Règle importante** : Tous les styles bruts (hex, px, etc.) doivent être définis dans `tokens.ts` et non dans les composants.

**Enchaînement des providers dans App.tsx** :
1. `QueryClientProvider` : Gestion des requêtes et cache React Query
2. `ThemeProvider` : Gestion du thème (light/dark/auto) et PaperProvider
3. `AuthProvider` : Gestion de l'authentification et de la session
4. `NavigationContainer` + `RootNavigator` : Navigation de l'application

### `/src/components/ui/`
**Rôle** : Composants UI du UI Kit Suivi, réutilisables et basés sur les tokens.

**Composants principaux** :
- `SuiviButton.tsx` : Bouton principal du UI Kit Suivi
  - Variantes : `primary` (brand.primary `#005CE6`), `ghost` (transparent avec bordure), `destructive` (error `#D32F2F`)
  - Utilise `tokens.spacing`, `tokens.radius`, `tokens.typography.button`
  - Gère les états disabled et loading
  - **Intégré dans** : `HomeScreen`, `MoreScreen`
- `SuiviCard.tsx` : Composant Card du UI Kit Suivi
  - Variantes : `default` (avec shadow) ou `outlined` (avec border)
  - Elevation : `none`, `sm`, `md`, `lg`, `xl` (mappé vers `tokens.shadows`)
  - Padding tokenisé : `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`
  - Utilise `tokens.spacing`, `tokens.radius`, `tokens.shadows`
  - **Intégré dans** : `HomeScreen` (Recent Activity cards), `MyTasksScreen` (task items)
- `FilterChip.tsx` : Chip pour les filtres
  - États : `selected` (fond primary) / `default` (fond surface)
  - Utilise `tokens.spacing`, `tokens.radius`, `tokens.typography.body2`
  - Couleurs dynamiques basées sur le thème
  - **Intégré dans** : `HomeScreen` (Quick Filters), `MyTasksScreen` (filter bar)

**Règle** : Tous les composants UI doivent s'appuyer sur les tokens (`src/theme/tokens.ts`) pour garantir une cohérence visuelle. Aucun style hardcodé (hex, px, etc.) n'est autorisé.

### `/components/` et `/src/components/`
**Rôle** : Composants UI réutilisables.

- `/components/layout/` : Composants de structure (ScreenContainer dans `components/layout/`)
- `/src/components/ui/` : Composants UI de base (PrimaryButton, FilterChip, Card) - voir ci-dessus
- `/src/components/layout/` : Composants de layout (ScreenHeader dans `src/components/layout/`)
- `/src/components/Screen.tsx` : Wrapper standardisé pour tous les écrans
- `/components/ui/` : Futurs composants UI Suivi avancés basés sur React Native Paper
- `/components/media/` : Assets graphiques (logos Suivi)

## Data Flow (flux de données)

### 1. Authentification
```
User saisit email/password
    ↓
LoginScreen.handleSignIn()
    ↓
AuthProvider.signIn() → SecureStore.setItemAsync('access_token', token)
    ↓
setAccessToken(token) → Context mise à jour
    ↓
RootNavigator détecte accessToken → Passe à App (AppNavigator → MainTabNavigator)
```

### 2. Récupération de données (ex: Tâches)
```
MyTasksScreen utilise useMyTasks()
    ↓
useMyTasks() vérifie React Query cache
    ↓
Si pas en cache → queryFn() appelle getMyTasks(accessToken, params)
    ↓
getMyTasks() appelle apiFetch('/me/tasks', {}, accessToken)
    ↓
apiFetch() fait fetch(API_BASE_URL + '/me/tasks', { headers: { Authorization: Bearer ... } })
    ↓
Backend retourne JSON → Parse → Retour à React Query
    ↓
React Query met à jour le cache → useMyTasks() retourne { tasks, isLoading, ... }
    ↓
MyTasksScreen re-render avec les données
```

### 3. Navigation
```
User appuie sur une tâche dans MyTasksScreen
    ↓
navigation.navigate('TaskDetail', { taskId: item.id }) (typé avec AppStackParamList)
    ↓
TaskDetailScreen monte → useQuery(['task', taskId])
    ↓
Si pas en cache → getTaskById(accessToken, taskId)
    ↓
Affichage des détails
```

### 4. Recherche unifiée (Search Engine)
```
User tape dans HomeSearchBar
    ↓
HomeSearchBar.onChangeQuery(text) → HomeScreen.handleSearchChange(text)
    ↓
HomeScreen met à jour searchInputValue (UX immédiate)
    ↓
debouncedSearch(text) → setTimeout 300ms
    ↓
performSearch(query) via sélecteur Zustand
    ↓
searchStore.performSearch() → set({ status: 'loading' })
    ↓
searchService.search(query)
    ├─ Si API_MODE === 'mock' → searchMock(query)
    │   ├─ getTasksStore() → filtre tâches
    │   ├─ NOTIFICATIONS → filtre notifications
    │   └─ mockProjects → filtre projets
    └─ Si API_MODE === 'api' → GET /api/search?q=...
    ↓
Résultats retournés → searchStore.results
    ↓
HomeScreen se met à jour via sélecteurs (useSearchResults, useHasSearchQuery)
    ↓
Affichage des résultats (SuiviCard) + masquage des activités récentes
    ↓
User tap sur un résultat → navigation vers TaskDetail ou Notifications
```

### 4. Démarrage de l'app
```
App.tsx monte
    ↓
QueryClientProvider monte (React Query)
    ↓
ThemeProvider monte
    ├─ Utilise useColorScheme() pour détecter le mode système (si initialMode === 'auto')
    ├─ Charge le thème effectif (light ou dark)
    └─ Encapsule PaperProvider avec le thème
    ↓
AuthProvider monte
    ↓
RootNavigator monte
    ↓
AuthProvider charge token depuis SecureStore (isLoading = true)
    ↓
RootNavigator affiche AppLoadingScreen (isLoading === true)
    ↓
SecureStore.getItemAsync('access_token')
    ├─ Si token trouvé → accessToken = token
    └─ Si pas de token → accessToken = null
    ↓
isLoading = false
    ↓
RootNavigator décide :
  - Si !accessToken → Auth (AuthNavigator → LoginScreen)
  - Si accessToken → App (AppNavigator → MainTabNavigator)
```

## Points de connexion futurs avec l'API Suivi

### 1. Authentification (`/src/auth/AuthProvider.tsx`)
**Actuel** : Token mock généré localement
**Futur** : 
```typescript
async function signIn(email: string, password: string): Promise<void> {
  // Remplacer par :
  const response = await apiFetch<{ accessToken: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.accessToken);
  setAccessToken(response.accessToken);
}
```

### 2. API Client (`/src/api/client.ts`)
**Actuel** : `API_BASE_URL = 'https://api.suivi.local'` (placeholder)
**Futur** : 
- Définir l'URL réelle dans un fichier de configuration d'environnement
- Ajouter gestion de refresh token si nécessaire
- Ajouter intercepteurs pour gérer les erreurs 401 (déconnexion automatique)

### 3. Nouvelles APIs (`/src/api/`)
**À créer** :
- `projects.ts` : `getProjects()`, `getProjectById()`, etc.
- `notifications.ts` : `getNotifications()`, `markAsRead()`, etc.
- `users.ts` : `getCurrentUser()`, `updateProfile()`, etc.
- `auth.ts` : `login()`, `logout()`, `refreshToken()`, etc.

### 4. Hooks React Query (`/src/hooks/`)
**À créer** :
- `useProjects.ts`
- `useNotifications.ts`
- `useCurrentUser.ts`
- etc.

## Pattern utilisé

**UI + Hooks + API Adapters**

1. **Screens (UI)** : Composants React présentationnels uniquement
2. **Hooks** : Logique de récupération de données (React Query)
3. **API Adapters** : Fonctions qui appellent le backend via `apiFetch`
4. **Mocks (actuel)** : L'authentification est mockée, mais les appels API sont déjà structurés pour être branchés facilement

Cette architecture permet une transition simple des mocks vers le backend réel : il suffit de remplacer les fonctions dans `/src/api/` sans toucher aux écrans ni aux hooks.

---

## Search Engine (Moteur de recherche unifié)

### Objectif

Le moteur de recherche unifié permet de rechercher dans **tâches**, **notifications** et **projets** depuis la barre de recherche de l'écran Home. Il est conçu pour être :

- **API-ready** : Architecture mock → API réelle sans modification des écrans
- **Performant** : Debounce 300ms, sélecteurs Zustand atomiques
- **UX optimale** : Feedback immédiat, masquage du contenu normal pendant la recherche

### Architecture générale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SEARCH ENGINE ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐                                                       │
│  │  HomeSearchBar   │  Composant de présentation (agnostique du domaine)    │
│  │  (props only)    │  Props: value, onChangeQuery, onSubmit                │
│  └────────┬─────────┘                                                       │
│           │ onChangeQuery(text)                                             │
│           ▼                                                                 │
│  ┌──────────────────┐                                                       │
│  │   HomeScreen     │  Gère le debounce (300ms) + connexion au store        │
│  │  (controller)    │  Hooks: usePerformSearch, useClearSearch, etc.        │
│  └────────┬─────────┘                                                       │
│           │ performSearch(query)                                            │
│           ▼                                                                 │
│  ┌──────────────────┐                                                       │
│  │  searchStore.ts  │  Store Zustand isolé                                  │
│  │   (Zustand)      │  State: query, results, status, error                 │
│  └────────┬─────────┘                                                       │
│           │ search(query)                                                   │
│           ▼                                                                 │
│  ┌──────────────────┐                                                       │
│  │ searchService.ts │  Service mock + API-ready                             │
│  │  (mock / API)    │  Recherche dans: tasks, notifications, projects       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ├─────────────────┬─────────────────┐                             │
│           ▼                 ▼                 ▼                             │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐                   │
│  │ getTasksStore()│ │  NOTIFICATIONS │ │  mockProjects  │                   │
│  │   (tasks)      │ │  (suiviData)   │ │  (projects)    │                   │
│  └────────────────┘ └────────────────┘ └────────────────┘                   │
│                                                                             │
│           ▲                                                                 │
│           │ SearchResult[]                                                  │
│           │                                                                 │
│  ┌──────────────────┐                                                       │
│  │   HomeScreen     │  Affiche les résultats via sélecteurs                 │
│  │  (results UI)    │  useSearchResults(), useHasSearchQuery()              │
│  └──────────────────┘                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Structure du dossier `src/features/search/`

```
src/features/search/
├── searchTypes.ts       # Types TypeScript
├── searchService.ts     # Service de recherche (mock + API-ready)
├── searchStore.ts       # Store Zustand isolé
└── searchSelectors.ts   # Sélecteurs optimisés
```

#### `searchTypes.ts`

Définit les types pour la recherche unifiée :

```typescript
export type SearchResultType = 'task' | 'notification' | 'project';

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  taskId?: string;
  notificationId?: string;
  projectId?: string;
};

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
```

#### `searchService.ts`

Service de recherche qui respecte `API_MODE` :

```typescript
export async function search(query: string): Promise<SearchResult[]> {
  if (API_MODE === 'mock') {
    return searchMock(query);  // Recherche locale dans les mocks
  }
  // TODO: API réelle
  // return apiFetch<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`);
  return searchMock(query);
}
```

**Recherche mock** :
- **Tâches** : Recherche dans `title`, `description`, `projectName`
- **Notifications** : Recherche dans `title`, `message`
- **Projets** : Recherche dans `name`

#### `searchStore.ts`

Store Zustand isolé avec actions :

```typescript
interface SearchStoreState {
  query: string;
  results: SearchResult[];
  status: SearchStatus;
  error: string | null;
  
  setQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
}
```

#### `searchSelectors.ts`

Sélecteurs atomiques pour éviter les re-renders inutiles :

```typescript
// Sélecteurs atomiques
export const useSearchQuery = () => useSearchStore((s) => s.query);
export const useSearchResults = () => useSearchStore((s) => s.results);
export const useSearchStatus = () => useSearchStore((s) => s.status);

// Sélecteurs d'actions (stable reference)
export const usePerformSearch = () => useSearchStore((s) => s.performSearch);
export const useClearSearch = () => useSearchStore((s) => s.clearSearch);

// Sélecteurs dérivés
export const useIsSearching = () => useSearchStore((s) => s.status === 'loading');
export const useHasSearchQuery = () => useSearchStore((s) => s.query.length > 0);
export const useHasResults = () => useSearchStore((s) => s.results.length > 0);
```

### Intégration dans HomeScreen

#### Debounce côté écran

Le debounce est géré dans `HomeScreen`, pas dans `HomeSearchBar` :

```typescript
// State local pour l'input (UX immédiate)
const [searchInputValue, setSearchInputValue] = useState('');

// Ref pour le debounce (compatible React Native)
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// Debounce de 300ms
const debouncedSearch = useCallback((query: string) => {
  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }
  debounceRef.current = setTimeout(() => {
    if (query.trim()) {
      performSearch(query);
    } else {
      clearSearch();
    }
  }, 300);
}, [performSearch, clearSearch]);
```

#### Affichage conditionnel

```tsx
{/* Résultats de recherche (si query active) */}
{hasSearchQuery && (
  <SearchResultsSection />
)}

{/* Contenu normal (masqué si recherche active) */}
{!hasSearchQuery && (
  <>
    <AIDailyPulseCard />
    <RecentActivitiesSection />
  </>
)}
```

#### Navigation vers les résultats

```typescript
const handleSearchResultPress = useCallback((result: SearchResult) => {
  if (result.type === 'task' && result.taskId) {
    navigation.navigate('TaskDetail', { taskId: result.taskId });
  } else if (result.type === 'notification' && result.notificationId) {
    navigation.navigate('MainTabs', { screen: 'Notifications' });
  }
  // Projets : navigation future
}, [navigation]);
```

### Règles UX

| Règle | Implémentation |
|-------|----------------|
| **Debounce 300ms** | Évite les appels excessifs pendant la frappe |
| **Masquage contenu** | AI Pulse + Activités masquées pendant recherche |
| **État loading** | Affiche "Recherche en cours..." |
| **État empty** | Affiche "Aucun résultat pour «query»" |
| **État error** | Affiche message d'erreur générique |
| **Clavier** | `keyboardShouldPersistTaps="handled"` sur ScrollView |

### Design system & conventions

| Élément | Convention |
|---------|------------|
| **Spacing** | `tokens.spacing.*` exclusivement |
| **Colors** | `tokens.colors.*` exclusivement |
| **Cards** | `SuiviCard` pour les résultats |
| **Text** | `SuiviText` avec variants appropriés |
| **i18n** | Namespace `search.*` (`search.results`, `search.noResults`, etc.) |

### Clés i18n

```json
{
  "search": {
    "results": "Résultats",
    "noResults": "Aucun résultat pour \"{{query}}\"",
    "searching": "Recherche en cours...",
    "tasks": "Tâches",
    "notifications": "Notifications",
    "projects": "Projets"
  }
}
```

### Extension future (API réelle)

#### 1. Basculer vers l'API

Dans `searchService.ts`, remplacer le fallback :

```typescript
export async function search(query: string): Promise<SearchResult[]> {
  if (API_MODE === 'mock') {
    return searchMock(query);
  }
  
  // Mode API : appeler l'endpoint réel
  return apiFetch<SearchResult[]>(
    `/api/search?q=${encodeURIComponent(query)}`,
    {},
    accessToken
  );
}
```

#### 2. Fonctionnalités futures

| Fonctionnalité | Description |
|----------------|-------------|
| **Scoring** | Trier par pertinence (titre exact > description > projet) |
| **Highlight** | Mettre en surbrillance le terme recherché |
| **Filtres** | Filtrer par type (tâches uniquement, notifications uniquement) |
| **Pagination** | Limiter les résultats + "Voir plus" |
| **Historique** | Suggestions basées sur les recherches précédentes |
| **Recherche avancée** | Syntaxe `type:task status:todo` |

### Vérification après modification

1. ✅ Recherche fonctionne avec terme valide
2. ✅ Résultats affichés dans SuiviCard
3. ✅ Navigation vers TaskDetail fonctionne
4. ✅ Navigation vers Notifications fonctionne
5. ✅ État loading affiché
6. ✅ État empty affiché
7. ✅ Activités masquées pendant recherche
8. ✅ Dark mode supporté
9. ✅ i18n fonctionnel (FR/EN)

