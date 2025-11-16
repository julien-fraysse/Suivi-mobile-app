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
│   ├── App.tsx                      # Composant principal de l'app avec providers (QueryClientProvider, ThemeProvider, AuthProvider)
│   │   ├── theme/
│   │   │   └── ThemeProvider.tsx    # Provider central pour gérer le thème (light/dark/auto) et PaperProvider
│   ├── api/
│   │   ├── client.ts                # Client HTTP générique (apiFetch)
│   │   └── tasks.ts                 # Fonctions API pour les tâches
│   ├── auth/
│   │   ├── AuthContext.tsx          # Context et hook useAuth
│   │   ├── AuthProvider.tsx         # Provider d'authentification
│   │   └── index.ts                 # Exports auth
│   ├── components/
│   │   └── Screen.tsx               # Wrapper de screen avec SafeAreaView
│   ├── hooks/
│   │   └── useMyTasks.ts            # Hook React Query pour les tâches
│   ├── navigation/
│   │   ├── RootNavigator.tsx        # Navigateur racine (AppLoading, Auth, App)
│   │   ├── MainTabNavigator.tsx     # Bottom Tab Navigator (Home, Tasks, Notifs, More)
│   │   └── types.ts                 # Types TypeScript pour toutes les routes
│   └── screens/
│       ├── AppLoadingScreen.tsx     # Écran de chargement initial
│       ├── HomeScreen.tsx           # Écran d'accueil
│       ├── LoginScreen.tsx          # Écran de connexion
│       ├── MyTasksScreen.tsx        # Liste des tâches utilisateur
│       ├── TaskDetailScreen.tsx     # Détails d'une tâche
│       ├── NotificationsScreen.tsx  # Notifications
│       └── MoreScreen.tsx           # Menu "Plus" (déconnexion, etc.)
├── theme/
│   ├── tokens.ts                    # Design tokens (colors, spacing, typography)
│   ├── paper-theme.ts               # Thème React Native Paper (light/dark)
│   └── index.ts                     # Exports theme
├── components/                      # Composants UI réutilisables
│   ├── layout/
│   │   └── ScreenContainer.tsx      # Container de screen avec SafeAreaView
│   ├── ui/                          # Composants UI (Button, Card, Text, etc.)
│   └── media/                       # Logos et assets Suivi
└── package.json                     # Dépendances et scripts
```

## Responsabilités par dossier

### `/src/api/`
**Rôle** : Couche d'abstraction pour les appels HTTP vers le backend Suivi.

- `client.ts` : Fonction générique `apiFetch<T>()` qui gère :
  - Construction de l'URL (API_BASE_URL + path)
  - Headers (Authorization Bearer token, Content-Type)
  - Gestion d'erreurs HTTP
- `tasks.ts` : Fonctions spécifiques aux tâches :
  - `getMyTasks(accessToken, params)` → `/me/tasks`
  - `getTaskById(accessToken, taskId)` → `/tasks/{id}`

**Point de connexion API** : C'est ici que toutes les futures fonctions API seront ajoutées (projects, users, notifications, etc.).

### `/src/auth/`
**Rôle** : Gestion de l'authentification et de la session utilisateur.

- `AuthContext.tsx` : Définit le type `AuthContextValue` et le hook `useAuth()`
- `AuthProvider.tsx` : 
  - Stocke le token dans `SecureStore` (expo-secure-store)
  - Gère l'état `accessToken` et `isLoading`
  - Fournit `signIn()` et `signOut()`
  - **Actuellement mocké** : `signIn()` génère un token mock

**Point de connexion API** : La fonction `signIn()` dans `AuthProvider.tsx` doit être remplacée par un appel réel à `/api/auth/login` ou équivalent.

### `/src/hooks/`
**Rôle** : Hooks React Query pour récupérer et gérer les données côté client.

- `useMyTasks.ts` : Hook `useInfiniteQuery` pour la pagination des tâches
  - Utilise `getMyTasks()` de `/src/api/tasks.ts`
  - Gère le cache React Query
  - Expose `tasks`, `isLoading`, `fetchNextPage`, etc.

**Pattern** : Créer un hook par domaine (ex: `useProjects`, `useNotifications`) qui encapsule la logique React Query.

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

