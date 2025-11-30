# Conventions de code Mobile Suivi

## Introduction

Ce document définit les conventions de code pour l'application mobile Suivi. Ces conventions garantissent la cohérence du code et facilitent la collaboration entre développeurs.

---

## Table des matières

1. [Introduction](#introduction)
2. [Architecture Suivi mobile](#architecture-suivi-mobile)
3. [Mode opératoire obligatoire](#mode-opératoire-obligatoire)
4. [Conventions de nommage](#conventions-de-nommage)
5. [Structure des fichiers](#structure-des-fichiers)
6. [Types TypeScript](#types-typescript)
7. [Composants React](#composants-react)
8. [Quick Actions](#quick-actions)
9. [Hooks personnalisés](#hooks-personnalisés)
10. [Internationalisation (i18n)](#internationalisation-i18n)
11. [React Query](#react-query)
12. [API Mode](#api-mode)
13. [Gestion d'état (Zustand)](#gestion-détat-zustand)
14. [Imports](#imports)
15. [Styles](#styles)
16. [Commentaires et documentation](#commentaires-et-documentation)
17. [Gestion des erreurs](#gestion-des-erreurs)
18. [Bonnes pratiques](#bonnes-pratiques)
19. [Résumé des conventions](#résumé-des-conventions)
20. [Outils recommandés](#outils-recommandés)

---

## Architecture Suivi mobile

### Règles strictes de modification

**Règle absolue** : Ne jamais créer, déplacer, renommer ou dupliquer un fichier sans demande explicite.

### Dossiers modifiables

Tu peux uniquement modifier les dossiers suivants :

- ✅ `src/components/**` : Composants UI réutilisables
- ✅ `src/screens/**` : Écrans de l'application
- ✅ `src/services/**` : Services API avec sélection Mock/API
- ✅ `src/store/**` : Stores Zustand (état global)
- ✅ `src/providers/**` : Providers React

### Fichiers et dossiers interdits

**Interdiction totale de modifier** :

- ❌ `App.tsx` : Point d'entrée de l'application
- ❌ `RootNavigator.tsx` : Navigation racine (gère Auth vs App)
- ❌ `ThemeProvider.tsx` : Gestion du thème
- ❌ `authStore.ts` / flow d'authentification : Sans exception, sauf ajout de données strictement utiles avec validation
- ❌ Ordre des providers dans `App.tsx` : Ordre strict à respecter

**Interdictions générales** :

- ❌ Créer un dossier supplémentaire sans validation
- ❌ Dupliquer un composant déjà existant
- ❌ Renommer un dossier sans raison
- ❌ Déplacer un fichier vers un nouvel endroit
- ❌ Créer des composants "helpers" inutiles
- ❌ Recréer une version alternative d'un composant déjà existant

### Principe de réutilisation

Si un fichier existe déjà, tu dois le réutiliser.  
Si un style existe déjà, tu dois utiliser les tokens.  
Si un composant existe déjà, tu dois l'utiliser tel quel ou l'étendre de manière compatible.

---

## Mode opératoire obligatoire

### Workflow standard

Toute modification doit suivre ce workflow strict :

**Analyse → Plan → Validation → Patch → Audit → Test**

### Étape 1 : Analyse

Avant toute modification, tu dois :

1. **Scanner l'arborescence `src/`** : Identifier tous les fichiers concernés
2. **Analyser les composants existants** : Comprendre la structure actuelle
3. **Identifier les fichiers concernés** : Lister précisément chaque fichier à modifier
4. **Fournir un plan de route clair et numéroté** : Expliquer chaque modification

**Le plan doit expliquer** :

- Les fichiers concernés
- Les changements exacts à effectuer
- L'impact potentiel sur :
  - Le layout (faible / moyen / élevé)
  - Les stores Zustand
  - La navigation
  - Les providers
  - Les autres composants

**Aucune ligne de code ne doit être modifiée sans ce plan préalable.**

### Étape 2 : Validation

**Attendre la validation humaine avant d'agir.**

Le plan doit être clair, détaillé et justifié avant toute exécution.

### Étape 3 : Patch

Après validation, produire le code :

- Ciblé : Seulement ce qui est nécessaire
- Minimal : Pas de refactoring inutile
- Stable : Pas de régression
- Conforme aux conventions : Respecter ce document

### Étape 4 : Audit

Après toute modification, effectuer un audit systématique :

1. **Audit architecture** :
   - ✅ Aucun dossier créé/modifié sans raison
   - ✅ Aucun fichier déplacé
   - ✅ Respect de la structure existante

2. **Audit UI** :
   - ✅ Layout : Aucun débordement
   - ✅ Spacing : Utilisation exclusive de `tokens.spacing`
   - ✅ Tokens : Tous les styles via `tokens.*`
   - ✅ Responsive : Composants adaptatifs

3. **Audit i18n** :
   - ✅ Aucune string en dur
   - ✅ Toutes les clés ajoutées dans `fr.json` et `en.json`
   - ✅ Utilisation de `t('...')` partout

4. **Audit TypeScript** :
   - ✅ Pas de `any`
   - ✅ Types stricts
   - ✅ Imports de types corrects

5. **Audit Zustand / React Query** :
   - ✅ Sélecteurs Zustand utilisés
   - ✅ Pas d'accès direct aux stores
   - ✅ React Query conforme (si utilisé)

6. **Audit régressions** :
   - ✅ Pas de layout cassé
   - ✅ Pas de navigation cassée
   - ✅ Pas de fonctionnalité perdue

**Format de l'audit** :

```
Audit architecture : OK / À corriger : ...
Audit UI : OK / À corriger : ...
Audit i18n : OK / À corriger : ...
Audit TypeScript : OK / À corriger : ...
Audit Zustand/React Query : OK / À corriger : ...
Audit régressions : OK / À corriger : ...
```

### Étape 5 : Test

Décrire :

- Comment vérifier la modification
- Les scénarios de régression éventuels
- Comment revenir en arrière si nécessaire

### Annoncer l'impact layout

Avant toute modification de layout, annoncer :

**"Impact layout : faible / moyen / élevé"**

---

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

---

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

---

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

**Règle stricte** : Pas de `any`. Utiliser des types appropriés ou `unknown` si nécessaire.

**Exemples** :
```typescript
// ✅ Typé correctement
function processData(data: Task): void {
  // ...
}

// ❌ Interdit
function processData(data: any): void {
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

---

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

---

## Quick Actions

### Règles strictes

**Règle 1** : Toujours respecter `quickAction.uiHint`.

Les Quick Actions sont identifiés par leur `uiHint`. Tu dois utiliser le composant correspondant à ce hint, jamais réinventer un composant.

**Règle 2** : Ne jamais réinventer un composant qui existe déjà.

Si un composant Quick Action existe déjà dans `src/components/tasks/quickactions/`, tu dois l'utiliser tel quel ou l'étendre de manière compatible.

**Règle 3** : Ne jamais créer un nouveau type de Quick Action sans spec formelle.

Tout nouveau type de Quick Action doit être spécifié formellement avant implémentation.

### Composants Quick Actions disponibles

Les composants suivants sont disponibles dans `src/components/tasks/quickactions/` :

- ✅ **`approval_dual_button`** : `QuickActionApproval.tsx` - Boutons d'approbation (Approuver/Refuser)
- ✅ **`status_chip`** : Utilisé dans le renderer principal - Chips de statut
- ✅ **`comment_text_input`** : `QuickActionComment.tsx` - Zone de texte pour commentaires
- ✅ **`stars_1_to_5`** : `QuickActionRating.tsx` - Système de notation par étoiles (1 à 5)
- ✅ **`progress_slider`** : `QuickActionProgress.tsx` - Slider de progression (0-100%)
- ✅ **`weather_picker`** : `QuickActionWeather.tsx` - Sélecteur de conditions météo
- ✅ **`calendar_date_picker`** : `QuickActionCalendar.tsx` - Sélecteur de date
- ✅ **`checkbox_toggle`** : `QuickActionCheckbox.tsx` - Case à cocher
- ✅ **`select_dropdown`** : `QuickActionSelect.tsx` - Liste déroulante

**Structure d'une Quick Action** :

```typescript
interface QuickAction {
  actionType: "COMMENT" | "APPROVAL" | "RATING" | "PROGRESS" | "WEATHER" | "CALENDAR" | "CHECKBOX" | "SELECT";
  uiHint: string; // Identifie le composant à utiliser
  payload?: Record<string, any>; // Données additionnelles
}
```

**Utilisation** :

```typescript
import { QuickActionRenderer } from '../components/tasks/quickactions/QuickActionRenderer';

<QuickActionRenderer quickAction={task.quickAction} />
```

Le `QuickActionRenderer` se charge de router vers le bon composant selon `quickAction.uiHint`.

---

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

---

## Internationalisation (i18n)

### Règles strictes

**Règle absolue** : TOUTES les strings visibles par l'utilisateur doivent obligatoirement passer par `t('...')`.

**Interdictions** :
- ❌ Aucun texte en dur dans les écrans ou composants
- ❌ Aucune string hardcodée
- ❌ Aucun placeholder texte sans i18n

### Structure des fichiers i18n

Les clés i18n sont définies dans :

- `/src/i18n/resources/fr.json` : Traductions françaises
- `/src/i18n/resources/en.json` : Traductions anglaises

**Respecter la structure existante** : Utiliser les namespaces existants (`common`, `screens.*`, etc.).

### Ajout de nouvelles clés

**Processus obligatoire** :

1. Identifier la string à traduire
2. Choisir un namespace approprié (ex: `screens.taskDetail.headerTitle`)
3. Ajouter la clé dans `fr.json` ET `en.json`
4. Utiliser `t('namespace.key')` dans le composant

**Exemple** :

```typescript
// ❌ Interdit
<Text>Ma tâche</Text>

// ✅ Correct
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <Text>{t('screens.myTasks.title')}</Text>;
}
```

**Dans `fr.json`** :
```json
{
  "screens": {
    "myTasks": {
      "title": "Ma tâche"
    }
  }
}
```

**Dans `en.json`** :
```json
{
  "screens": {
    "myTasks": {
      "title": "My task"
    }
  }
}
```

### Namespaces

**Règle** : Ne jamais créer un namespace i18n sans validation.

Utiliser les namespaces existants :
- `common.*` : Chaînes communes (boutons, labels, etc.)
- `screens.*` : Titres et labels spécifiques aux écrans
- `components.*` : Labels de composants réutilisables

### Conversion automatique

Lors des patches, convertir automatiquement toutes les strings en dur en clés i18n.

**Checklist i18n après chaque modification** :
- ✅ Aucune string en dur restante
- ✅ Toutes les clés ajoutées dans `fr.json` et `en.json`
- ✅ Namespace cohérent avec l'existant

---

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

---

## API Mode

### Configuration

**Fichier** : `/src/config/apiMode.ts`

Ce fichier contrôle le mode de fonctionnement de l'application (mock ou API réelle).

```typescript
export type ApiMode = 'mock' | 'api';
export const API_MODE: ApiMode = 'mock'; // Par défaut : mode mock
```

### Mode Mock (par défaut)

**Règle** : Mode mock obligatoire tant que le backend Suivi n'est pas connecté.

**Comportement en mode mock** :

- ✅ Aucun hook React Query n'est actif (`enabled: false` dans les hooks)
- ✅ Toutes les données viennent de `/src/mocks/`
- ✅ Les services retournent directement les mocks
- ✅ Aucun appel réseau n'est effectué

**Exemple de service en mode mock** :

```typescript
import { API_MODE } from '../config/apiMode';
import { mockTasks } from '../mocks/tasksMock';

export async function fetchTasks() {
  if (API_MODE === 'mock') {
    return mockTasks; // Retourne les mocks directement
  }
  return apiGet('/tasks'); // Ne s'exécute jamais en mode mock
}
```

### Mode API (futur)

**Comportement en mode API** :

- ✅ Les hooks React Query s'activent (`enabled: true`)
- ✅ Les services appellent les vrais endpoints
- ✅ Les données viennent du backend Suivi Desktop
- ✅ Cache et retry gérés par React Query

**Activation du mode API** :

```typescript
// Dans /src/config/apiMode.ts
export const API_MODE: ApiMode = 'api'; // Basculer en mode API
```

### Hooks React Query conditionnels

Les hooks React Query sont conditionnels selon le mode :

```typescript
export function useTasksQuery() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: API_MODE === 'api', // Actif uniquement en mode API
  });
}
```

**En mode mock** : `enabled: false` → Le hook ne s'exécute jamais  
**En mode API** : `enabled: true` → Le hook s'exécute et appelle les endpoints

---

## Gestion d'état (Zustand)

### Règles strictes

**Règle 1** : Utiliser des sélecteurs pour éviter les re-renders inutiles.

**Règle 2** : Interdiction totale d'utiliser `useAuthStore()` sans sélecteur.

**Règle 3** : Interdiction totale d'accès direct aux stores dans des composants profonds.

### Stores autorisés

Les stores suivants sont autorisés dans `src/store/` :

- ✅ `authStore.ts` : État d'authentification (user, isLoading)
- ✅ `preferencesStore.ts` : Préférences utilisateur (themeMode)
- ✅ `uiStore.ts` : État UI (quickCaptureOpen)

**Interdiction totale** : Créer un store supplémentaire sans spec validée.

### Utilisation avec sélecteurs

**❌ Mauvais** : Re-render sur tout changement de store

```typescript
// ❌ Interdit : accès direct au store
const { user, isLoading } = useAuthStore();
```

**✅ Bon** : Re-render uniquement si la valeur sélectionnée change

```typescript
// ✅ Correct : sélecteur spécifique
const user = useAuthStore((s) => s.user);
const isLoading = useAuthStore((s) => s.isLoading);
```

**Exemple complet** :

```typescript
import { useAuthStore } from '@store/authStore';

function MyComponent() {
  // ✅ Sélecteur pour user
  const user = useAuthStore((s) => s.user);
  
  // ✅ Sélecteur pour isLoading
  const isLoading = useAuthStore((s) => s.isLoading);
  
  // ✅ Sélecteur pour une action
  const setUser = useAuthStore((s) => s.setUser);
  
  // Le composant ne se re-rend que si user ou isLoading change
  // Pas si d'autres propriétés du store changent
}
```

### Modification des stores

**Règle** : Utiliser les actions définies dans le store, jamais modifier directement.

```typescript
// ✅ Correct : utiliser l'action
const setUser = useAuthStore((s) => s.setUser);
setUser(newUser);

// ❌ Interdit : modification directe
useAuthStore.getState().user = newUser; // ❌
```

### Sélecteurs complexes

Pour des sélecteurs complexes (combinaisons, calculs), utiliser `useMemo` ou créer un hook personnalisé :

```typescript
// ✅ Correct : sélecteur avec calcul
const isAuthenticated = useAuthStore(
  (s) => useMemo(() => s.user !== null, [s.user])
);
```

---

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

---

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

**Padding/margin** : Exclusivement via `tokens.spacing`. Aucun padding/margin hardcodé n'est autorisé.

**Exemples** :
```typescript
// ✅ Utiliser les tokens
import { tokens } from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,        // 16px
    margin: tokens.spacing.sm,         // 8px
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
    margin: 8,                      // ❌ Utiliser tokens.spacing.sm
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

### Aucune couleur hardcodée

**Règle absolue** : Aucune couleur hardcodée n'est autorisée.

Toutes les couleurs doivent venir de `tokens.colors.*` ou `theme.colors` (pour les écrans uniquement, pas pour les composants UI Suivi).

### Headers des écrans

**Règle stricte** : Toujours utiliser `ScreenHeader` pour les headers d'écran.

**Interdiction totale** : Créer un header custom.

**Exemple** :
```typescript
// ✅ Correct
import { ScreenHeader } from '../components/layout/ScreenHeader';

<Screen>
  <ScreenHeader title={t('screens.taskDetail.title')} />
  {/* Contenu */}
</Screen>

// ❌ Interdit : header custom
<Screen>
  <View style={styles.header}>
    <Text>Mon titre</Text>
  </View>
  {/* Contenu */}
</Screen>
```

### Wrappers et layout

**Règle** : Interdiction des wrappers inutiles.

Ne pas créer de `View` supplémentaires si ce n'est pas nécessaire pour le layout.

**Règle responsive** : Tous les composants doivent être responsive sans déborder.

Aucun composant ne doit dépasser les limites de l'écran. Utiliser `flex`, `flexShrink`, `flexWrap` appropriés.

**Exemple** :
```typescript
// ✅ Responsive
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: tokens.spacing.md,
  },
  text: {
    flexShrink: 1, // Permet au texte de se rétrécir si nécessaire
  },
});

// ❌ Peut déborder
const styles = StyleSheet.create({
  container: {
    width: 500, // ❌ Largeur fixe peut déborder sur petits écrans
    padding: tokens.spacing.md,
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

---

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

---

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

---

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

---

## Résumé des conventions

### Tableau récapitulatif

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

### Règles architecturales

| Règle | Détails |
|-------|---------|
| **Dossiers modifiables** | `src/components/**`, `src/screens/**`, `src/services/**`, `src/store/**`, `src/providers/**` |
| **Fichiers interdits** | `App.tsx`, `RootNavigator.tsx`, `ThemeProvider.tsx`, `authStore.ts` (sans validation) |
| **Création de fichiers** | Interdite sans demande explicite |
| **Duplication** | Interdite : réutiliser l'existant |

### Règles i18n

| Règle | Détails |
|-------|---------|
| **Strings visibles** | Obligatoirement via `t('...')` |
| **Fichiers** | `src/i18n/resources/fr.json`, `src/i18n/resources/en.json` |
| **Namespaces** | Respecter la structure existante |
| **Conversion** | Automatique lors des patches |

### Règles Zustand

| Règle | Détails |
|-------|---------|
| **Sélecteurs** | Obligatoires : `useAuthStore((s) => s.user)` |
| **Stores autorisés** | `authStore.ts`, `preferencesStore.ts`, `uiStore.ts` |
| **Création de stores** | Interdite sans spec validée |
| **Accès direct** | Interdit sans sélecteur |

### Règles API Mode

| Mode | Comportement |
|------|--------------|
| **Mock (défaut)** | Mocks depuis `src/mocks/`, hooks React Query désactivés |
| **API** | Endpoints réels, hooks React Query actifs |

### Règles Styles

| Règle | Détails |
|-------|---------|
| **Tokens** | Exclusivement `tokens.*` pour tous les styles |
| **Padding/Margin** | Exclusivement `tokens.spacing` |
| **Couleurs** | `tokens.colors.*` (UI Suivi) ou `theme.colors` (écrans) |
| **Header** | Exclusivement `ScreenHeader`, pas de header custom |
| **Wrappers** | Interdits si inutiles |
| **Responsive** | Composants adaptatifs sans déborder |

---

## Task Deletion & Refresh

### Principe

- **Delete = update optimiste du TasksContext** + appel au service (`tasksService.deleteTask`)
- Les écrans de liste ne doivent **PAS** déclencher de refresh en boucle sur `focus`
- Le refresh global doit être soit :
  - Manuel (pull-to-refresh), soit
  - Déclenché explicitement par une action utilisateur claire

### Flux de suppression

1. L'utilisateur confirme la suppression dans TaskDetailScreen
2. `deleteTaskInContext(id)` est appelé depuis TasksContext
3. Mise à jour optimiste : `setTasks(prev => prev.filter(...))`
4. Appel au service : `tasksService.deleteTask(id)` pour synchroniser le mock store
5. Navigation retour → MyTasksScreen affiche immédiatement la liste sans la tâche supprimée

### Règles

- ❌ Ne jamais utiliser `useFocusEffect` pour déclencher un refresh automatique
- ✅ Utiliser les méthodes optimistes du TasksContext (`deleteTaskInContext`, `updateTask`, etc.)
- ✅ Le pull-to-refresh reste disponible pour un refresh manuel explicite

### Implementation technique

#### TasksContext

La méthode `deleteTaskInContext` :
- Met à jour l'UI immédiatement (mise à jour optimiste)
- Appelle `tasksService.deleteTask(id)` pour synchroniser le mock store
- Rollback automatique en cas d'erreur (recharge depuis le store)

#### TaskDetailScreen

Le handler `handleDeleteTask` :
- Affiche un modal de confirmation
- Appelle `deleteTaskInContext(task.id)` depuis le contexte
- Navigue vers l'écran précédent après succès
- Affiche une erreur en cas d'échec

#### MyTasksScreen

- **Pas de `useFocusEffect`** : Le contexte se met à jour automatiquement
- **Pull-to-refresh uniquement** : Refresh manuel via `RefreshControl`
- La liste se met à jour automatiquement grâce au contexte partagé

### Future API implementation

Quand l'API sera branchée :
- `deleteTaskInContext` appellera `DELETE /api/tasks/:id`
- En cas de succès : la mise à jour optimiste reste valide
- En cas d'erreur : rollback automatique + notification d'erreur
- Les queries React Query seront invalidées automatiquement

### Soft delete vs Hard delete

Pour l'instant :
- les mocks utilisent un hard delete
- l'API utilisera un soft delete (`deleted: true`)

Les écrans doivent toujours filtrer les tâches supprimées :

`tasks.filter(t => !t.deleted && !t.archived)`

---

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
