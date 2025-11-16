# Navigation Mobile Suivi

## Architecture de navigation

L'application utilise **React Navigation v7** avec une architecture hiérarchique :

1. **RootNavigator** : Gère la navigation conditionnelle (AppLoading → Auth vs App)
2. **AppLoadingScreen** : Écran de chargement initial (restauration de session)
3. **AuthNavigator** : Stack d'authentification (si non connecté)
4. **AppNavigator** : Stack principal pour l'app authentifiée
   - **MainTabNavigator** : Bottom tabs (Home, Tasks, Notifications, More)
   - **TaskDetailScreen** : Stack modal pour les détails d'une tâche

### Schéma de navigation

```
RootNavigator
  ├─ AppLoading (si isLoading === true)
  │   └─ AppLoadingScreen
  │
  ├─ Auth (si !accessToken)
  │   └─ AuthNavigator (Stack)
  │       └─ Login
  │           └─ LoginScreen
  │
  └─ App (si accessToken)
      └─ AppNavigator (Stack)
          ├─ Main
          │   └─ MainTabNavigator (Bottom Tabs)
          │       ├─ Home → HomeScreen
          │       ├─ MyTasks → MyTasksScreen
          │       ├─ Notifications → NotificationsScreen
          │       └─ More → MoreScreen
          │
          └─ TaskDetail → TaskDetailScreen
```

**Tous les fichiers de navigation sont organisés dans** : `/src/navigation/`

## RootNavigator

**Fichier** : `/src/navigation/RootNavigator.tsx`

**Rôle** : Navigateur racine de l'application qui gère la logique globale de navigation.

### Structure

Le RootNavigator contient 3 stacks conditionnelles :

1. **AppLoading** : Affiché pendant le chargement initial (restauration de session)
2. **Auth** : Stack d'authentification (si l'utilisateur n'est pas connecté)
3. **App** : Stack principale de l'app (si l'utilisateur est connecté)

### Logique de routage

```typescript
RootNavigator()
  ├─ AppLoading (si isLoading === true)
  │   └─ AppLoadingScreen
  │
  ├─ Auth (si !accessToken)
  │   └─ AuthNavigator → LoginScreen
  │
  └─ App (si accessToken)
      └─ AppNavigator
          ├─ Main → MainTabNavigator
          └─ TaskDetail → TaskDetailScreen
```

### Types

**Fichier** : `/src/navigation/types.ts`

Tous les types de navigation sont centralisés dans `types.ts` :

- `RootStackParamList` : Paramètres de la navigation racine
- `AuthStackParamList` : Paramètres de la stack d'authentification
- `AppStackParamList` : Paramètres de la stack principale
- `MainTabParamList` : Paramètres des onglets

Ces types sont utilisés pour sécuriser la navigation et éviter les erreurs de typage.

## AppLoadingScreen

**Fichier** : `/src/screens/AppLoadingScreen.tsx`

**Rôle** : Écran de chargement initial affiché pendant la restauration de session et l'initialisation de l'app.

**Description** : Affiche le logo/text "Suivi" avec un indicateur de chargement pendant que l'app restaure la session utilisateur depuis SecureStore.

**Navigation** :
- Affiché automatiquement quand `AuthProvider.isLoading === true`
- Redirige automatiquement vers `Auth` ou `App` une fois le chargement terminé

**Fonctionnalités** :
- Logo/text "Suivi" stylisé
- Indicateur de chargement (ActivityIndicator)
- Utilise le thème pour les couleurs

## AuthNavigator

**Fichier** : `/src/navigation/RootNavigator.tsx` (fonction `AuthNavigator`)

**Rôle** : Stack de navigation pour les écrans d'authentification.

### Screens

| Route Name | Component | Description |
|------------|-----------|-------------|
| `Login` | `LoginScreen` | Écran de connexion (email/password) |

### Navigation depuis LoginScreen

- **Succès login** : `signIn()` met à jour `accessToken` → `RootNavigator` détecte le changement → Affiche automatiquement `AppNavigator`

## AppNavigator

**Fichier** : `/src/navigation/RootNavigator.tsx` (fonction `AppNavigator`)

**Rôle** : Stack principal de l'application authentifiée.

### Screens

| Route Name | Component | Description |
|------------|-----------|-------------|
| `Main` | `MainTabNavigator` | Bottom Tab Navigator avec 4 onglets |
| `TaskDetail` | `TaskDetailScreen` | Détails d'une tâche (accessible depuis MyTasksScreen) |

### Navigation vers TaskDetail

```typescript
// Depuis MyTasksScreen (avec typage sécurisé)
const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
navigation.navigate('TaskDetail', { taskId: item.id });
```

**Paramètres** :
- `taskId: string` : ID de la tâche à afficher

**Typage** : Utilise `AppStackParamList` depuis `src/navigation/types.ts` pour sécuriser la navigation.

## MainTabNavigator

**Fichier** : `/src/navigation/MainTabNavigator.tsx`

**Rôle** : Bottom Tab Navigator avec 4 onglets principaux.

### Onglets

| Tab Label | Route Name | Component | Icône | Description |
|-----------|------------|-----------|-------|-------------|
| `Home` | `Home` | `HomeScreen` | `home` (MaterialCommunityIcons) | Écran d'accueil |
| `Tasks` | `MyTasks` | `MyTasksScreen` | `check-circle` | Liste des tâches de l'utilisateur |
| `Notifications` | `Notifications` | `NotificationsScreen` | `bell` | Liste des notifications |
| `More` | `More` | `MoreScreen` | `dots-horizontal` | Menu "Plus" (déconnexion, etc.) |

### Configuration des tabs

**Style Suivi avec tokens exclusifs** :

```typescript
<Tab.Navigator
  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: tokens.colors.brand.primary, // #4F5DFF
    tabBarInactiveTintColor: tokens.colors.neutral.medium, // #98928C
    tabBarHideOnKeyboard: true, // Évite les bugs de layout avec le clavier
    tabBarStyle: {
      backgroundColor: tokens.colors.background.surface, // #F4F2EE
      borderTopWidth: 1,
      borderTopColor: tokens.colors.border.default, // #E8E8E8
      // Pas de hauteur fixe : React Navigation gère automatiquement la hauteur optimale
      // Pas de padding vertical : Le safe area est géré automatiquement par SafeAreaProvider
    },
    tabBarLabelStyle: {
      fontFamily: tokens.typography.label.fontFamily, // Inter_500Medium
      fontSize: tokens.typography.label.fontSize, // 13
      fontWeight: tokens.typography.label.fontWeight, // '500'
    },
  }}
>
```

**Caractéristiques** :
- **Style Suivi exclusif** : Utilise uniquement les tokens Suivi (pas de theme.colors)
- **Couleurs** :
  - Active : `tokens.colors.brand.primary` (#4F5DFF) - Violet Suivi
  - Inactive : `tokens.colors.neutral.medium` (#98928C) - Gris Suivi
  - Background : `tokens.colors.background.surface` (#F4F2EE) - Sand Suivi
  - Border : `tokens.colors.border.default` (#E8E8E8) - Bordure claire
- **Typography** : Inter Medium (13px) pour les labels
- **Layout** : Pas de hauteur fixe ni de padding vertical personnalisé - React Navigation gère automatiquement
- **Safe Area** : La TabBar respecte automatiquement le safe area du bas grâce à `SafeAreaProvider` dans `App.tsx`
- **Keyboard** : `tabBarHideOnKeyboard: true` évite les bugs de layout avec le clavier
- Pas de header (chaque écran gère son propre header via ScreenHeader)
- Icônes MaterialCommunityIcons (24px) pour chaque onglet
- Typage avec `MainTabParamList` depuis `types.ts`

### Bottom Tab Bar Layout

**Fichier de configuration** : `/src/navigation/MainTabNavigator.tsx`

**Approche minimale** :
- **Pas de hauteur fixe** : React Navigation calcule automatiquement la hauteur optimale basée sur le contenu et le safe area
- **Pas de padding vertical personnalisé** : Le `SafeAreaProvider` gère automatiquement l'espace nécessaire au safe area du bas
- **Configuration minimale** : Seulement `backgroundColor`, `borderTopWidth`, et `borderTopColor` sont définis

**Pourquoi éviter une hauteur fixe** :
- Une hauteur fixe peut causer un débordement sur iOS si elle ne tient pas compte du safe area
- React Navigation gère automatiquement la hauteur optimale en fonction du contenu (icônes + labels) et du safe area
- Cette approche garantit que la TabBar reste toujours visible sans débordement

**Comment ajuster l'espacement à l'avenir** :
- **Si nécessaire** : Ajouter un padding vertical minimal (4px max) uniquement pour l'espacement visuel interne
- **Ne jamais** définir une hauteur fixe supérieure à la hauteur naturelle de la TabBar
- **Respecter** le safe area : Laisser React Navigation et `SafeAreaProvider` gérer l'espace au safe area

### Gestion du Safe Area pour la TabBar

**Configuration** :
- `SafeAreaProvider` est placé au niveau racine dans `App.tsx` (avant `QueryClientProvider`)
- La TabBar respecte automatiquement le safe area du bas sur iOS grâce à cette configuration
- Les écrans individuels utilisent `ScreenContainer` avec `SafeAreaView` **uniquement pour le top** (`safeAreaEdges = ['top']` par défaut)

**Pourquoi les écrans n'utilisent pas le safe area du bas** :
- Les écrans dans les tabs doivent laisser la TabBar gérer le safe area du bas
- Si les écrans appliquaient aussi le safe area du bas, cela créerait un conflit et pourrait causer un débordement
- `ScreenContainer` utilise par défaut `safeAreaEdges = ['top']` pour éviter ce conflit

**Architecture Safe Area** :
```
App.tsx
└── SafeAreaProvider (niveau racine)
    └── NavigationContainer
        └── MainTabNavigator
            └── TabBar (gère automatiquement le safe area du bas)
                └── Écrans (ScreenContainer avec safeAreaEdges = ['top'] uniquement)
```

## Flow d'authentification et navigation

### 1. App démarre

```
App.tsx monte
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

### 2. User se connecte

```
User saisit email/password dans LoginScreen
    ↓
User appuie sur "Sign In"
    ↓
handleSignIn() appelle signIn(email, password)
    ↓
AuthProvider.signIn() appelle l'API (actuellement mock)
    ↓
Token sauvegardé dans SecureStore
    ↓
setAccessToken(token) met à jour le Context
    ↓
RootNavigator détecte accessToken !== null
    ↓
Affiche App (AppNavigator → MainTabNavigator)
```

### 3. User se déconnecte

```
User appuie sur "Sign Out" dans MoreScreen
    ↓
handleSignOut() appelle signOut()
    ↓
AuthProvider.signOut() supprime le token de SecureStore
    ↓
setAccessToken(null) met à jour le Context
    ↓
RootNavigator détecte accessToken === null
    ↓
Affiche Auth (AuthNavigator → LoginScreen)
```

## Organisation des fichiers de navigation

**Tous les fichiers de navigation sont dans** : `/src/navigation/`

| Fichier | Rôle |
|---------|------|
| `RootNavigator.tsx` | Navigateur racine (AppLoading, Auth, App) |
| `MainTabNavigator.tsx` | Bottom Tab Navigator avec 4 onglets |
| `types.ts` | Types TypeScript pour toutes les routes |

**Structure** :
```
src/navigation/
├── RootNavigator.tsx      # Navigateur racine
├── MainTabNavigator.tsx   # Bottom tabs
└── types.ts               # Types de navigation (RootStackParamList, AppStackParamList, etc.)
```

## Comment ajouter un nouvel écran

### 1. Écran dans un tab existant

Si l'écran doit être accessible depuis un onglet existant :

**Exemple** : Ajouter un écran "Settings" dans l'onglet "More"

1. Créer `/src/screens/SettingsScreen.tsx`
2. Ajouter dans `MainTabNavigator.tsx` :
   ```typescript
   import { SettingsScreen } from '../screens/SettingsScreen';
   
   <Tab.Screen
     name="Settings"
     component={SettingsScreen}
     options={{
       tabBarLabel: 'Settings',
       tabBarIcon: ({ color, size }) => (
         <MaterialCommunityIcons name="cog" size={size} color={color} />
       ),
     }}
   />
   ```
3. Mettre à jour `types.ts` :
   ```typescript
   export type MainTabParamList = {
     Home: undefined;
     MyTasks: undefined;
     Notifications: undefined;
     More: undefined;
     Settings: undefined; // Nouveau
   };
   ```

### 2. Écran en stack modal

Si l'écran doit être accessible depuis un autre écran (comme TaskDetail) :

**Exemple** : Ajouter un écran "EditTask"

1. Créer `/src/screens/EditTaskScreen.tsx`
2. Ajouter dans `src/navigation/RootNavigator.tsx` dans `AppNavigator` :
   ```typescript
   import { EditTaskScreen } from '../screens/EditTaskScreen';
   
   <AppStack.Screen
     name="EditTask"
     component={EditTaskScreen}
   />
   ```
3. Mettre à jour `src/navigation/types.ts` :
   ```typescript
   export type AppStackParamList = {
     Main: NavigatorScreenParams<MainTabParamList>;
     TaskDetail: { taskId: string };
     EditTask: { taskId: string }; // Nouveau
   };
   ```
4. Naviguer depuis TaskDetailScreen (avec typage) :
   ```typescript
   const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
   navigation.navigate('EditTask', { taskId: task.id });
   ```

### 3. Nouveau flow d'authentification

Si l'écran doit être accessible uniquement pour les utilisateurs non authentifiés :

**Exemple** : Ajouter un écran "Register"

1. Créer `/src/screens/RegisterScreen.tsx`
2. Ajouter dans `src/navigation/RootNavigator.tsx` dans `AuthNavigator` :
   ```typescript
   import { RegisterScreen } from '../screens/RegisterScreen';
   
   <AuthStack.Screen
     name="Register"
     component={RegisterScreen}
   />
   ```
3. Mettre à jour `src/navigation/types.ts` :
   ```typescript
   export type AuthStackParamList = {
     Login: undefined;
     Register: undefined; // Nouveau
   };
   ```
4. Naviguer depuis LoginScreen (avec typage) :
   ```typescript
   const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
   navigation.navigate('Register');
   ```

## Types de navigation

### Typage TypeScript

Tous les types de navigation sont centralisés dans `/src/navigation/types.ts` :

```typescript
export type RootStackParamList = {
  AppLoading: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  TaskDetail: { taskId: string };
};

export type MainTabParamList = {
  Home: undefined;
  MyTasks: undefined;
  Notifications: undefined;
  More: undefined;
};
```

**Utilisation dans les écrans** :
```typescript
// Pour naviguer depuis MyTasksScreen vers TaskDetail
const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
navigation.navigate('TaskDetail', { taskId: item.id });

// Pour utiliser les paramètres de route dans TaskDetailScreen
const route = useRoute<RouteProp<AppStackParamList, 'TaskDetail'>>();
const { taskId } = route.params;
```

### Navigation Stack (AppNavigator)

- **TaskDetailScreen** : Écran modal pour afficher les détails d'une tâche
- Navigation : `navigation.navigate('TaskDetail', { taskId })` (typé avec `AppStackParamList`)
- Retour : `navigation.goBack()` (back button natif)

### Navigation Tab (MainTabNavigator)

- **4 onglets** : Home, Tasks, Notifications, More
- Navigation : Changement d'onglet via tab bar
- Retour : Non applicable (les onglets restent en mémoire)
- Icônes : MaterialCommunityIcons pour chaque onglet

## Bonnes pratiques

1. **Utiliser le composant Screen** : Tous les écrans doivent utiliser le wrapper `Screen` pour le SafeAreaView et le padding
2. **Gérer les états de chargement** : Afficher des ActivityIndicator pendant le chargement
3. **Gérer les erreurs** : Afficher des messages d'erreur clairs
4. **Types TypeScript** : Toujours utiliser les types depuis `src/navigation/types.ts` pour sécuriser la navigation
5. **Thème** : Utiliser `useTheme()` de React Native Paper pour les couleurs
6. **Organisation** : Tous les fichiers de navigation doivent être dans `src/navigation/`

## Navigation et paramètres

### Définir les types de paramètres

```typescript
// Dans TaskDetailScreen.tsx
type TaskDetailRouteParams = {
  TaskDetail: {
    taskId: string;
  };
};

type TaskDetailRoute = RouteProp<TaskDetailRouteParams, 'TaskDetail'>;
```

### Utiliser les paramètres

```typescript
const route = useRoute<TaskDetailRoute>();
const { taskId } = route.params;
```

### Naviguer avec paramètres

```typescript
navigation.navigate('TaskDetail', { taskId: item.id });
```

