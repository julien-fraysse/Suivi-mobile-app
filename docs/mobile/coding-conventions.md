# Conventions de code Mobile Suivi

## Introduction

Ce document définit les conventions de code pour l'application mobile Suivi. Ces conventions garantissent la cohérence du code et facilitent la collaboration entre développeurs.

## Conventions de nommage

### Fichiers

#### Composants React

**Règle** : PascalCase, suffixe `.tsx` pour les composants React, `.ts` pour les utilitaires.

**Exemples** :
- ✅ `MyTasksScreen.tsx`
- ✅ `LoginScreen.tsx`
- ✅ `TaskDetailScreen.tsx`
- ✅ `ScreenContainer.tsx`
- ❌ `my-tasks-screen.tsx` (kebab-case)
- ❌ `MyTasksScreen.jsx` (extension .jsx)

#### Hooks personnalisés

**Règle** : camelCase avec préfixe `use`, suffixe `.ts`.

**Exemples** :
- ✅ `useMyTasks.ts`
- ✅ `useAuth.ts` (dans AuthContext)
- ✅ `useProjects.ts` (futur)
- ❌ `use-my-tasks.ts`
- ❌ `MyTasksHook.ts`

#### Services / API

**Règle** : camelCase, suffixe `.ts`.

**Exemples** :
- ✅ `tasks.ts` (dans `/src/api/`)
- ✅ `client.ts` (dans `/src/api/`)
- ✅ `auth.ts` (futur)
- ❌ `Tasks.ts`
- ❌ `tasks.service.ts`

#### Utilitaires

**Règle** : camelCase, suffixe `.ts`.

**Exemples** :
- ✅ `utils.ts`
- ✅ `formatDate.ts`
- ❌ `Utils.ts`
- ❌ `format-date.ts`

#### Types / Interfaces

**Règle** : PascalCase, suffixe `.ts` (ou dans le même fichier que leur utilisation).

**Exemples** :
- ✅ Types dans `tasks.ts` : `Task`, `TaskStatus`, `MyTasksPage`
- ✅ Types dans `AuthContext.tsx` : `AuthContextValue`
- ❌ `task.types.ts` (à éviter, préférer dans le même fichier)

### Composants React

**Règle** : PascalCase, même nom que le fichier.

**Exemples** :
```typescript
// Dans MyTasksScreen.tsx
export function MyTasksScreen() {
  // ...
}
```

**Nommage des props** :
- ✅ Interfaces : PascalCase avec suffixe `Props`
- ✅ Props : camelCase

**Exemples** :
```typescript
export interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
}) => {
  // ...
};
```

### Variables et fonctions

**Règle** : camelCase.

**Exemples** :
- ✅ `const taskList = [];`
- ✅ `function formatDate(date: Date): string { }`
- ✅ `const isLoading = true;`
- ❌ `const TaskList = [];`
- ❌ `function FormatDate() { }`

### Constantes

**Règle** : UPPER_SNAKE_CASE pour les constantes globales, camelCase pour les constantes locales.

**Exemples** :
- ✅ `const API_BASE_URL = 'https://api.suivi.com';`
- ✅ `const ACCESS_TOKEN_KEY = 'access_token';`
- ✅ `const localVariable = 'value';` (camelCase si locale)

### Types TypeScript

**Règle** : PascalCase, pas de préfixe `I` ou `T` (style moderne TypeScript).

**Exemples** :
- ✅ `type Task = { ... };`
- ✅ `type TaskStatus = 'todo' | 'in_progress';`
- ✅ `interface MyComponentProps { ... }`
- ❌ `type ITask = { ... };`
- ❌ `type TTaskStatus = ...;`

### Hooks personnalisés

**Règle** : camelCase avec préfixe `use`, retourne un objet ou une valeur.

**Exemples** :
```typescript
export function useMyTasks(options: UseMyTasksOptions = {}) {
  // ...
  return {
    ...query,
    tasks,
  };
}
```

**Nommage des options** : PascalCase avec suffixe `Options`.

**Exemples** :
- ✅ `UseMyTasksOptions`
- ✅ `UseProjectsOptions`

### Fonctions API

**Règle** : camelCase avec verbe d'action (get, create, update, delete).

**Exemples** :
- ✅ `getMyTasks(accessToken, params)`
- ✅ `getTaskById(accessToken, taskId)`
- ✅ `createTask(accessToken, taskData)`
- ✅ `updateTask(accessToken, taskId, updates)`
- ✅ `deleteTask(accessToken, taskId)`

## Structure des fichiers

### Composants React

**Structure recommandée** :

```typescript
// 1. Imports
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Screen } from '../components/Screen';
import { tokens } from '../../theme';

// 2. Types (si dans le même fichier)
export interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

// 3. Composant principal
export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
}) => {
  const theme = useTheme();
  
  return (
    <Screen>
      {/* JSX */}
    </Screen>
  );
};

// 4. Fonctions utilitaires (si locales)
function helperFunction() {
  // ...
}

// 5. Styles
const styles = StyleSheet.create({
  // ...
});
```

### Hooks personnalisés

**Structure recommandée** :

```typescript
// 1. Imports
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth';
import { getMyTasks, MyTasksFilters, MyTasksPage } from '../api/tasks';

// 2. Types
export type UseMyTasksOptions = {
  filters?: MyTasksFilters;
};

// 3. Hook
export function useMyTasks(options: UseMyTasksOptions = {}) {
  const { filters } = options;
  const { accessToken } = useAuth();

  const query = useQuery<MyTasksPage>({
    // ...
  });

  return {
    ...query,
    tasks,
  };
}
```

### Fichiers API

**Structure recommandée** :

```typescript
// 1. Imports
import { apiFetch } from './client';

// 2. Types
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  // ...
};

// 3. Fonctions API
export async function getMyTasks(
  accessToken: string,
  params: { page?: number; pageSize?: number } = {},
): Promise<MyTasksPage> {
  // ...
}
```

## Types TypeScript

### Types vs Interfaces

**Règle** : Utiliser `interface` pour les objets (props, contexte, etc.), `type` pour les unions, intersections, et primitives.

**Exemples** :
```typescript
// Interface pour les objets
interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

// Type pour les unions
type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

// Type pour les intersections
type MyType = BaseType & AdditionalType;

// Interface pour les contextes
export interface AuthContextValue {
  accessToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
}
```

### Typage strict

**Règle** : Toujours typer les paramètres et retours de fonctions.

**Exemples** :
```typescript
// ✅ Typé
function formatDate(dateString: string): string {
  // ...
}

// ❌ Non typé
function formatDate(dateString) {
  // ...
}
```

### Types optionnels

**Règle** : Utiliser `?` pour les propriétés optionnelles, `| null` pour les valeurs nullable.

**Exemples** :
```typescript
type Task = {
  id: string;
  title: string;
  dueDate?: string | null; // Optionnel et nullable
  projectName?: string | null;
};
```

## Composants React

### Un composant par fichier

**Règle** : Un seul composant exporté par fichier (sauf composants utilitaires très liés).

**Exemples** :
- ✅ `MyTasksScreen.tsx` → Exporte uniquement `MyTasksScreen`
- ❌ `Screens.tsx` → Exporte plusieurs écrans

### Structure du composant

**Règle** : 
1. Props destructurées en paramètres
2. Hooks en haut
3. Logique métier
4. JSX

**Exemples** :
```typescript
export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
}) => {
  // 1. Hooks
  const theme = useTheme();
  const { accessToken } = useAuth();
  
  // 2. Logique métier
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };
  
  // 3. JSX
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};
```

### Structure des écrans

**Règle** : Tous les écrans doivent utiliser `Screen` comme wrapper principal, et `ScreenHeader` si un titre est nécessaire.

**Exemple** :
```typescript
import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/layout/ScreenHeader';

export function MyScreen() {
  return (
    <Screen>
      <ScreenHeader title="My Screen" subtitle="Description" />
      {/* Contenu */}
    </Screen>
  );
}
```

**Règles d'utilisation** :
1. **Tous les écrans** : Utilisent `Screen` comme wrapper principal (gère SafeAreaView, padding, background)
2. **Titres d'écran** : Utilisent `ScreenHeader` au lieu de créer un header custom
3. **Écrans scrollables** : Utilisent `scrollable={true}` sur `Screen` au lieu de créer un `ScrollView` custom
4. **Boutons principaux** : Utilisent `PrimaryButton` pour les actions importantes

**Exemple avec scroll** :
```typescript
<Screen scrollable>
  <ScreenHeader title="Details" />
  {/* Contenu scrollable */}
</Screen>
```

## Hooks personnalisés

### Nommage

**Règle** : Préfixe `use`, camelCase.

**Exemples** :
- ✅ `useMyTasks`
- ✅ `useProjects`
- ❌ `UseMyTasks`
- ❌ `getMyTasks` (pas un hook)

### Retour

**Règle** : Retourner un objet avec toutes les valeurs nécessaires, ou une valeur unique.

**Exemples** :
```typescript
// ✅ Objet
export function useMyTasks() {
  return {
    tasks,
    isLoading,
    isError,
    fetchNextPage,
  };
}

// ✅ Valeur unique
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
```

## React Query

### Query Keys

**Règle** : Tableaux avec des clés descriptives, inclure les paramètres de filtrage.

**Exemples** :
```typescript
// ✅ Clé descriptive avec filtres
queryKey: ['myTasks', filters]

// ✅ Clé avec ID
queryKey: ['task', taskId]

// ❌ Clé générique
queryKey: ['data']
```

### Query Functions

**Règle** : Utiliser les fonctions API existantes, passer `accessToken` en paramètre.

**Exemples** :
```typescript
queryFn: () => {
  if (!accessToken) {
    throw new Error('No access token');
  }
  return getMyTasks(accessToken, {
    page: pageParam,
    pageSize: 20,
    filters,
  });
}
```

### Invalidation

**Règle** : Invalider les queries après mutations (create, update, delete).

**Exemples** :
```typescript
const mutation = useMutation({
  mutationFn: (taskData) => createTask(accessToken, taskData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['myTasks'] });
  },
});
```

## Imports

### Ordre des imports

**Règle** : 
1. React et React Native
2. Bibliothèques tierces
3. Composants internes
4. Hooks
5. API / Services
6. Thème / Tokens
7. Types (si imports de types)

**Exemples** :
```typescript
// 1. React et React Native
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Bibliothèques tierces
import { useTheme } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';

// 3. Composants internes
import { Screen } from '../components/Screen';

// 4. Hooks
import { useAuth } from '../auth';
import { useMyTasks } from '../hooks/useMyTasks';

// 5. API / Services
import { getTaskById } from '../api/tasks';

// 6. Thème / Tokens
import { tokens } from '../../theme';
```

### Chemins d'imports

**Règle** : Chemins relatifs (`../`, `../../`), éviter les alias de chemins pour l'instant.

**Exemples** :
```typescript
// ✅ Relatif
import { Screen } from '../components/Screen';
import { tokens } from '../../theme';

// ❌ Alias (si non configuré)
import { Screen } from '@components/Screen';
```

### Imports de types

**Règle** : Utiliser `import type` pour les imports de types uniquement.

**Exemples** :
```typescript
import type { Task, TaskStatus } from '../api/tasks';
import { getMyTasks } from '../api/tasks';
```

## Styles

### StyleSheet.create

**Règle** : Utiliser `StyleSheet.create` pour tous les styles, placer en bas du fichier.

**Exemples** :
```typescript
const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
  },
});
```

### Utilisation des tokens

**Règle stricte** : Tout styling passe par tokens. Tous les styles bruts (hex, px, etc.) doivent être définis dans `src/theme/tokens.ts` et non dans les composants, sauf exception rare documentée.

**Règle stricte pour les composants UI** : Les composants du UI Kit Suivi (`SuiviButton`, `FilterChip`, `SuiviCard`) doivent utiliser **EXCLUSIVEMENT** `tokens.colors.*` et **PAS** `theme.colors` de React Native Paper. Le `ThemeProvider` injecte les tokens Suivi dans React Native Paper pour les composants Paper, mais les composants UI Suivi utilisent directement les tokens.

**Aucune exception autorisée pour** :
- Couleurs dans les composants UI Suivi : **EXCLUSIVEMENT** `tokens.colors.*` (pas `theme.colors`)
- Couleurs dans les écrans (texte, etc.) : `tokens.colors.*` de préférence, `theme.colors` acceptable pour la cohérence avec Paper
- Spacing/padding/margin : **EXCLUSIVEMENT** `tokens.spacing`
- Border radius : **EXCLUSIVEMENT** `tokens.radius`
- Typography : **EXCLUSIVEMENT** `tokens.typography`
- Shadows : **EXCLUSIVEMENT** `tokens.shadows`

**Exemples** :
```typescript
// ✅ Utiliser les tokens
import { tokens } from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,        // 16px
    borderRadius: tokens.radius.md,     // 20px
    backgroundColor: tokens.colors.brand.primary, // #0066FF
  },
  title: {
    fontSize: tokens.typography.h4.fontSize,    // 32
    fontWeight: tokens.typography.h4.fontWeight, // '400'
  },
});

// ❌ Hardcodé (interdit)
const styles = StyleSheet.create({
  container: {
    padding: 16,                    // ❌ Utiliser tokens.spacing.md
    borderRadius: 20,               // ❌ Utiliser tokens.radius.md
    backgroundColor: '#0066FF',     // ❌ Utiliser tokens.colors.brand.primary
  },
  title: {
    fontSize: 32,                   // ❌ Utiliser tokens.typography.h4.fontSize
  },
});
```

**Règle pour les nouveaux composants UI** : Les nouveaux composants UI doivent s'appuyer sur les tokens (`tokens.ts`) pour les couleurs, spacing, radius, typography, etc.

**Exemples** :
```typescript
// ✅ Tokens
const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,      // 16px
    borderRadius: tokens.radius.sm,   // 12px
    fontSize: tokens.typography.body1.fontSize, // 16px
  },
});

// ❌ Hardcodé
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
});
```

### Utilisation du thème

**Règle 1** : Les composants doivent éviter d'hardcoder les couleurs et utiliser le thème / tokens.

**Règle 2** : Utiliser `useTheme()` pour les couleurs dynamiques (light/dark mode).

**Règle 3** : L'ajout d'un nouveau composant doit être compatible avec le theming (au minimum pour le mode clair).

**Exemples** :

```typescript
// ✅ Utiliser useTheme() pour les couleurs dynamiques
import { useTheme } from 'react-native-paper';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.onSurface }}>Texte</Text>
    </View>
  );
};
```

```typescript
// ❌ Hardcoder les couleurs
const MyComponent = () => {
  return (
    <View style={{ backgroundColor: '#FFFFFF' }}>  // ❌ Hardcodé
      <Text style={{ color: '#212121' }}>Texte</Text>  // ❌ Hardcodé
    </View>
  );
};
```

**Couleurs disponibles via `useTheme()`** :
- `theme.colors.primary` : Couleur primaire (s'adapte au thème)
- `theme.colors.background` : Fond principal (blanc en light, noir en dark)
- `theme.colors.surface` : Surface principale (blanc en light, gris foncé en dark)
- `theme.colors.onSurface` : Texte sur surface (gris foncé en light, blanc en dark)
- `theme.colors.onSurfaceVariant` : Texte secondaire
- `theme.colors.outline` : Bordure
- `theme.colors.error` : Couleur d'erreur
- etc.

**Pour changer le mode de thème** :
```typescript
import { useThemeMode } from '../theme/ThemeProvider';

const SettingsScreen = () => {
  const { themeMode, setThemeMode, isDark } = useThemeMode();
  
  // setThemeMode('light') | setThemeMode('dark') | setThemeMode('auto')
};
```

## Commentaires et documentation

### JSDoc pour les fonctions importantes

**Règle** : Ajouter JSDoc pour les fonctions publiques (API, hooks, utilitaires).

**Exemples** :
```typescript
/**
 * Récupère les tâches de l'utilisateur avec pagination et filtres.
 * 
 * @param accessToken - Token d'authentification JWT
 * @param params - Paramètres de pagination et filtres
 * @param params.page - Numéro de page (défaut: 1)
 * @param params.pageSize - Nombre d'éléments par page (défaut: 20)
 * @param params.filters - Filtres optionnels (statut, etc.)
 * @returns Promesse résolue avec une page de tâches
 */
export async function getMyTasks(
  accessToken: string,
  params: { page?: number; pageSize?: number; filters?: MyTasksFilters } = {},
): Promise<MyTasksPage> {
  // ...
}
```

### Commentaires inline

**Règle** : Commenter le "pourquoi", pas le "quoi" (le code doit être auto-explicatif).

**Exemples** :
```typescript
// ✅ Pourquoi
// On utilise SecureStore pour stocker le token de manière sécurisée (chiffré sur iOS/Android)
await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);

// ❌ Quoi (inutile)
// Sauvegarder le token
await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
```

## Gestion des erreurs

### Try-Catch

**Règle** : Utiliser try-catch pour les opérations asynchrones, logger les erreurs, propager si nécessaire.

**Exemples** :
```typescript
try {
  await signIn(email, password);
} catch (error) {
  console.error('Error signing in:', error);
  setError(String(error) || 'Failed to sign in');
}
```

### Gestion des erreurs dans les hooks React Query

**Règle** : Laisser React Query gérer les erreurs, afficher dans l'UI via `isError` et `error`.

**Exemples** :
```typescript
const { data, isLoading, isError, error } = useQuery({
  queryKey: ['task', taskId],
  queryFn: () => getTaskById(accessToken, taskId),
});

if (isError) {
  return <ErrorView error={error} />;
}
```

## Bonnes pratiques

### 1. Éviter les casts `as any`

**Règle** : Utiliser des types appropriés, éviter `as any` sauf cas exceptionnels.

**Exemples** :
```typescript
// ❌ Éviter
const navigation = useNavigation();
(navigation as any).navigate('TaskDetail', { taskId });

// ✅ Préférer (typer correctement)
type RootStackParamList = {
  TaskDetail: { taskId: string };
};
const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
navigation.navigate('TaskDetail', { taskId });
```

### 2. Éviter les console.log en production

**Règle** : Utiliser `console.error` pour les erreurs, `console.warn` pour les avertissements, éviter `console.log` en production.

**Exemples** :
```typescript
// ✅ Erreur
console.error('Error loading tasks:', error);

// ✅ Avertissement
console.warn('Token might be expired');

// ❌ Log (enlever en production)
console.log('Tasks loaded:', tasks);
```

### 3. Destructuration des props

**Règle** : Toujours destructurer les props en paramètres.

**Exemples** :
```typescript
// ✅ Destructuré
export const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  // ...
};

// ❌ Non destructuré
export const MyComponent: React.FC<MyComponentProps> = (props) => {
  return <Text>{props.title}</Text>;
};
```

### 4. Fragments React

**Règle** : Utiliser `<>` au lieu de `<React.Fragment>`.

**Exemples** :
```typescript
// ✅ Fragment court
<>
  <Text>Title</Text>
  <Text>Subtitle</Text>
</>

// ❌ Fragment long (si pas de key nécessaire)
<React.Fragment>
  <Text>Title</Text>
  <Text>Subtitle</Text>
</React.Fragment>
```

## Résumé des conventions

| Élément | Convention | Exemple |
|---------|-----------|---------|
| **Fichiers composants** | PascalCase.tsx | `MyTasksScreen.tsx` |
| **Fichiers hooks** | camelCase.ts (préfixe `use`) | `useMyTasks.ts` |
| **Fichiers API** | camelCase.ts | `tasks.ts` |
| **Composants** | PascalCase | `MyComponent` |
| **Hooks** | camelCase (préfixe `use`) | `useMyTasks` |
| **Variables/Fonctions** | camelCase | `taskList`, `formatDate` |
| **Constantes globales** | UPPER_SNAKE_CASE | `API_BASE_URL` |
| **Types/Interfaces** | PascalCase | `Task`, `MyComponentProps` |
| **Query Keys** | Tableaux descriptifs | `['myTasks', filters]` |

## Outils recommandés

### Linter

**ESLint** : Configuré avec les règles TypeScript et React.

**Commandes** :
```bash
npm run lint
```

### Formatage

**Prettier** : (À configurer si nécessaire)

**Commandes** :
```bash
npm run format
```

### Type checking

**TypeScript** : Vérification stricte activée.

**Commandes** :
```bash
npx tsc --noEmit
```

