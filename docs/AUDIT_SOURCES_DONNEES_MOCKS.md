# Audit Complet des Sources de Données Mockées

**Date** : 2024-11-16  
**Objectif** : Cartographier toutes les sources de données mockées pour les tâches et notifications, identifier les incohérences et proposer une structure unifiée.

---

## 1. Résumé Exécutif

### Problèmes Identifiés

1. **MULTIPLES SOURCES DE TÂCHES** :
   - 4 fichiers différents contiennent des tâches mockées
   - IDs incohérents : '1', '2' vs 'task-1', 'task-2'
   - Certaines sources ont `quickAction`, d'autres non
   - `TasksContext` charge uniquement `suiviMock.ts` (correct depuis dernière unification)

2. **MULTIPLES SOURCES DE NOTIFICATIONS** :
   - 4 fichiers différents contiennent des notifications mockées
   - IDs de tâches référencées incohérents : '1', '2' vs 'task-1', 'task-2'
   - Structure différente : `relatedTaskId` vs `relatedId` vs `taskId`
   - `NotificationsStore` utilise ses propres données (non synchronisées)

3. **INCOHÉRENCE CRITIQUE IDS** :
   - Notifications dans `notificationsStore.tsx` référencent des IDs 'task-1', 'task-2', etc.
   - Mais `TasksContext` charge des tâches avec IDs '1', '2', etc.
   - **Résultat** : Navigation depuis notifications → "Task not found"

4. **SOURCES NON UTILISÉES** :
   - `src/mocks/tasks/mockTasks.ts` (16 tâches) : Plus utilisé par `TasksContext` (depuis unification)
   - `src/mocks/data/tasks.ts` : Non utilisé
   - `src/api/tasksApi.mock.ts` : Non utilisé par `TasksContext`
   - `src/mocks/data/notifications.ts` : Non utilisé

---

## 2. Cartographie Complète des Sources de Données

### 2.1. Sources de Tâches

#### A. `src/mocks/suiviMock.ts` ✅ **UTILISÉ PAR TasksContext**

**Statut** : Source active  
**Exported** : `export const tasks: Task[]`  
**Nombre** : 8 tâches  
**IDs** : '1', '2', '3', '4', '5', '6', '7', '8'  
**QuickAction** : ✅ Oui (toutes les 8 tâches ont `quickAction`)  
**Chargé par** : `TasksContext` via `mockTaskHelpers.ts`

```typescript
// Format des IDs
id: '1'  // Format numérique simple
id: '2'
// ...

// Format des quickAction
quickAction: {
  actionType: "COMMENT" | "APPROVAL" | "RATING" | "PROGRESS" | "WEATHER" | "CALENDAR" | "CHECKBOX" | "SELECT",
  uiHint: "comment_input" | "approval_dual_button" | "stars_1_to_5" | ...,
  payload?: Record<string, any>
}
```

**Propriétés complètes** :
- `id`, `title`, `status`, `dueDate`, `projectName`, `assigneeName`, `updatedAt`, `quickAction`

**Fonctions exportées** :
- `getTasks(params)` : Retourne pagination avec filtres
- `getTaskById(taskId)` : Retourne une tâche par ID

---

#### B. `src/mocks/tasks/mockTasks.ts` ❌ **NON UTILISÉ** (obsolète)

**Statut** : Obsolète depuis unification  
**Exported** : `export const MOCK_TASKS: Task[]`  
**Nombre** : 16 tâches  
**IDs** : 'task-1', 'task-2', ..., 'task-16'  
**QuickAction** : ❌ Non  
**Chargé par** : Personne (anciennement utilisé par `TasksContext`)

```typescript
// Format des IDs
id: 'task-1'  // Format avec préfixe "task-"
id: 'task-2'
// ...

// Pas de quickAction
```

**Propriétés** :
- `id`, `title`, `description`, `status`, `dueDate`, `projectId`, `projectName`, `assigneeName`, `assigneeInitials`, `createdAt`, `updatedAt`

**Note** : Ce fichier n'est plus utilisé depuis l'unification vers `suiviMock.ts`. Il peut être supprimé après vérification.

---

#### C. `src/api/tasksApi.mock.ts` ⚠️ **UTILISÉ PAR api/tasks.ts** (indirect)

**Statut** : Utilisé indirectement via `api/tasks.ts`  
**Exported** : `let MOCK_TASKS: Task[]` (interne, non exporté)  
**Nombre** : 10 tâches  
**IDs** : '1', '2', ..., '10'  
**QuickAction** : ❌ Non  
**Chargé par** : `api/tasks.ts` (si `USE_MOCK_API = true`)

```typescript
// Format des IDs
id: '1'  // Format numérique simple (compatible avec suiviMock.ts)
id: '2'
// ...
```

**Note** : Utilisé par les hooks via `api/tasks.ts`, mais `TasksContext` n'utilise pas cette source.

---

#### D. `src/mocks/data/tasks.ts` ❌ **NON UTILISÉ**

**Statut** : Non utilisé  
**Exported** : `let MOCK_TASKS: Task[]` (interne, non exporté)  
**Nombre** : 10 tâches  
**IDs** : '1', '2', ..., '10'  
**QuickAction** : ❌ Non  
**Chargé par** : Personne

**Note** : Fichier redondant qui n'est référencé nulle part.

---

### 2.2. Sources de Notifications

#### A. `src/features/notifications/notificationsStore.tsx` ✅ **UTILISÉ**

**Statut** : Source active  
**Exported** : `const INITIAL_NOTIFICATIONS: Notification[]` (interne)  
**Nombre** : 6 notifications  
**IDs** : 'notif-1', 'notif-2', ..., 'notif-6'  
**RelatedTaskId** : 'task-1', 'task-2', 'task-3', 'task-4', 'task-1', 'task-2'  
**Chargé par** : `NotificationsProvider` (état initial)

```typescript
// Format des IDs de notifications
id: 'notif-1'
id: 'notif-2'
// ...

// Format des relatedTaskId (PROBLÈME : IDs obsolètes)
relatedTaskId: 'task-1'  // ❌ Format "task-1" mais TasksContext utilise "1"
relatedTaskId: 'task-2'
// ...

// Structure Notification
{
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedTaskId?: string | null;  // Format actuel
  projectId?: string;
  actor?: { ... };
  author?: { ... };
}
```

**⚠️ PROBLÈME CRITIQUE** :
- Les `relatedTaskId` utilisent le format 'task-1', 'task-2', etc.
- Mais `TasksContext` charge des tâches avec IDs '1', '2', etc.
- **Résultat** : Navigation depuis notifications → "Task not found"

---

#### B. `src/mocks/suiviMock.ts` ⚠️ **DÉFINI MAIS NON UTILISÉ PAR NotificationsStore**

**Statut** : Défini mais non utilisé par le store  
**Exported** : `const MOCK_NOTIFICATIONS: Notification[]` (interne)  
**Nombre** : 5 notifications  
**IDs** : '1', '2', '3', '4', '5'  
**RelatedId** : '1', '2', '3', '4' (format numérique)  
**RelatedType** : 'task' | 'project'

```typescript
// Format des IDs de notifications
id: '1'
id: '2'
// ...

// Format des relatedId (compatible avec suiviMock.ts tasks)
relatedId: '1'  // ✅ Format compatible avec tasks de suiviMock.ts
relatedId: '2'
// ...

// Structure Notification (différente de notificationsStore.tsx)
{
  id: string;
  type: 'task_assigned' | 'task_completed' | ...;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;      // ⚠️ Nom différent : relatedId vs relatedTaskId
  relatedType?: 'task' | 'project';  // ⚠️ Pas dans notificationsStore
}
```

**Note** : Ces notifications sont exportées via `getNotifications()` mais ne sont pas utilisées par `NotificationsStore`.

---

#### C. `src/api/notificationsApi.mock.ts` ⚠️ **UTILISÉ PAR api/notifications.ts** (indirect)

**Statut** : Utilisé indirectement via `api/notifications.ts`  
**Exported** : `let MOCK_NOTIFICATIONS: Notification[]` (interne)  
**Nombre** : 5 notifications  
**IDs** : '1', '2', '3', '4', '5'  
**TaskId** : '1', '2', '3', '4' (format numérique)  
**Chargé par** : `api/notifications.ts` (si `USE_MOCK_API = true`)

```typescript
// Format des IDs de notifications
id: '1'
// ...

// Format des taskId (compatible avec suiviMock.ts tasks)
taskId: '1'  // ✅ Format compatible
// ...

// Structure Notification
{
  id: string;
  type: 'task_assigned' | ...;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  taskId?: string;        // ⚠️ Nom différent : taskId vs relatedTaskId
  projectId?: string;
}
```

**Note** : Utilisé par les hooks via `api/notifications.ts`, mais `NotificationsStore` n'utilise pas cette source.

---

#### D. `src/mocks/data/notifications.ts` ❌ **NON UTILISÉ**

**Statut** : Non utilisé  
**Exported** : `let MOCK_NOTIFICATIONS: Notification[]` (interne)  
**Nombre** : 5 notifications  
**IDs** : '1', '2', '3', '4', '5'  
**RelatedId** : '1', '2', '3', '4'  
**Chargé par** : Personne

**Note** : Fichier redondant qui n'est référencé nulle part.

---

## 3. Flux de Chargement des Données

### 3.1. Flux des Tâches

#### MyTasksScreen
```
App.tsx
  └─ TasksProvider
      └─ TasksContext.tsx
          └─ loadTasks()
              └─ mockTaskHelpers.ts::loadMockTasks()
                  └─ suiviMock.ts::tasks ✅
                      └─ useTasks(filter)
                          └─ MyTasksScreen::visibleTasks
```

**Source finale** : `src/mocks/suiviMock.ts` → `tasks`  
**Nombre de tâches** : 8  
**IDs** : '1', '2', '3', '4', '5', '6', '7', '8'  
**QuickAction** : ✅ Oui (toutes)

---

#### TaskDetailScreen
```
App.tsx
  └─ TasksProvider
      └─ TasksContext.tsx
          └─ tasks (state)
              └─ useTaskById(taskId)
                  └─ getTaskById(taskId)
                      └─ TaskDetailScreen::task
```

**Source finale** : `src/mocks/suiviMock.ts` → `tasks` (via TasksContext state)  
**IDs** : '1', '2', '3', '4', '5', '6', '7', '8'  
**QuickAction** : ✅ Oui

---

### 3.2. Flux des Notifications

#### NotificationsScreen
```
App.tsx
  └─ NotificationsProvider
      └─ notificationsStore.tsx
          └─ INITIAL_NOTIFICATIONS ✅
              └─ useNotificationsStore()
                  └─ NotificationsScreen::notifications
```

**Source finale** : `src/features/notifications/notificationsStore.tsx` → `INITIAL_NOTIFICATIONS`  
**Nombre de notifications** : 6  
**IDs de notifications** : 'notif-1', 'notif-2', ..., 'notif-6'  
**RelatedTaskId** : 'task-1', 'task-2', 'task-3', 'task-4' ❌ **INCOMPATIBLE**

---

#### MainTabNavigator (Badge)
```
App.tsx
  └─ NotificationsProvider
      └─ notificationsStore.tsx
          └─ notifications (state)
              └─ useNotificationsStore()
                  └─ MainTabNavigator::unreadCount
```

**Source finale** : `src/features/notifications/notificationsStore.tsx` (même source)

---

### 3.3. Navigation depuis Notifications

#### NotificationItem → TaskDetailScreen
```
NotificationItem::handleNotificationClick()
  └─ notification.relatedTaskId  // Ex: 'task-1'
      └─ getTaskByIdStrict('task-1')  // ❌ Ne trouve rien
          └─ TasksContext::tasks  // IDs: '1', '2', ...
              └─ Résultat: undefined → Alert "Tâche introuvable"
```

**PROBLÈME** : Les IDs des notifications ('task-1', 'task-2') ne correspondent pas aux IDs des tâches ('1', '2').

---

## 4. Analyse des Incohérences

### 4.1. Incohérence 1 : IDs des Tâches

| Source | Format ID | Exemples | Utilisé par |
|--------|-----------|----------|-------------|
| `suiviMock.ts` | Numérique | '1', '2', '3' | ✅ TasksContext |
| `mockTasks.ts` | Préfixe | 'task-1', 'task-2' | ❌ Obsolète |
| `tasksApi.mock.ts` | Numérique | '1', '2', '3' | ⚠️ api/tasks.ts |
| `mocks/data/tasks.ts` | Numérique | '1', '2', '3' | ❌ Non utilisé |

**Impact** : Aucun pour le moment (TasksContext utilise uniquement `suiviMock.ts`).

---

### 4.2. Incohérence 2 : IDs des Notifications vs Tâches

| Notification Source | RelatedTaskId Format | Task Source | Task ID Format | Compatible ? |
|---------------------|---------------------|-------------|----------------|--------------|
| `notificationsStore.tsx` | 'task-1', 'task-2' | `suiviMock.ts` | '1', '2' | ❌ **NON** |
| `suiviMock.ts` | '1', '2' | `suiviMock.ts` | '1', '2' | ✅ Oui |
| `notificationsApi.mock.ts` | '1', '2' | `tasksApi.mock.ts` | '1', '2' | ✅ Oui |

**Impact** : ❌ **CRITIQUE** - Navigation depuis notifications vers tâches échoue.

**Exemple** :
- Notification 'notif-1' a `relatedTaskId: 'task-1'`
- Mais `TasksContext` charge une tâche avec `id: '1'`
- `getTaskByIdStrict('task-1')` retourne `undefined` → Alert "Tâche introuvable"

---

### 4.3. Incohérence 3 : Structure des Notifications

| Source | Champ Related | Type | Structure Actor |
|--------|---------------|------|-----------------|
| `notificationsStore.tsx` | `relatedTaskId` | `string \| null` | `actor?` + `author?` (alias) |
| `suiviMock.ts` | `relatedId` | `string?` | Non défini |
| `notificationsApi.mock.ts` | `taskId` | `string?` | Non défini |
| `mocks/data/notifications.ts` | `relatedId` | `string?` | Non défini |

**Impact** : Code dupliqué, interfaces différentes, migration difficile.

---

### 4.4. Incohérence 4 : QuickAction

| Source Tâches | QuickAction Présent ? | Utilisé par QuickActionRenderer ? |
|---------------|----------------------|-----------------------------------|
| `suiviMock.ts` | ✅ Oui (8/8 tâches) | ✅ Oui (via TasksContext) |
| `mockTasks.ts` | ❌ Non | ❌ Non utilisé |
| `tasksApi.mock.ts` | ❌ Non | ❌ Non utilisé |
| `mocks/data/tasks.ts` | ❌ Non | ❌ Non utilisé |

**Impact** : Seule `suiviMock.ts` supporte les Quick Actions, ce qui est correct.

---

## 5. Cartographie des Utilisations

### 5.1. Écrans et Leurs Sources de Données

| Écran | Source Tâches | Source Notifications | Problème ? |
|-------|---------------|----------------------|------------|
| **MyTasksScreen** | `TasksContext` → `suiviMock.ts` | N/A | ✅ OK |
| **TaskDetailScreen** | `TasksContext` → `suiviMock.ts` | N/A | ✅ OK |
| **NotificationsScreen** | N/A | `NotificationsStore` → `notificationsStore.tsx` | ⚠️ IDs incompatibles |
| **NotificationItem** | `TasksContext` → `suiviMock.ts` | `NotificationsStore` → `notificationsStore.tsx` | ❌ Navigation échoue |

---

### 5.2. Hooks et Leurs Sources

| Hook | Source | Utilisé par |
|------|--------|-------------|
| `useTasks()` | `TasksContext` → `suiviMock.ts` | MyTasksScreen |
| `useTaskById()` | `TasksContext` → `suiviMock.ts` | TaskDetailScreen |
| `useNotificationsStore()` | `NotificationsStore` → `notificationsStore.tsx` | NotificationsScreen, MainTabNavigator, NotificationItem |

---

### 5.3. Contexts et Providers

| Provider | Source de Données | État Global ? |
|----------|-------------------|---------------|
| `TasksProvider` | `suiviMock.ts` (via `mockTaskHelpers.ts`) | ✅ Oui (React Context) |
| `NotificationsProvider` | `notificationsStore.tsx` (hardcodé) | ✅ Oui (React Context) |

---

## 6. Données Dupliquées

### 6.1. Tâches Dupliquées

**Non dupliquées** : `suiviMock.ts` est la source unique utilisée par `TasksContext`.

**Obsolètes** :
- `src/mocks/tasks/mockTasks.ts` : 16 tâches non utilisées
- `src/api/tasksApi.mock.ts` : 10 tâches (utilisées par `api/tasks.ts` mais pas par `TasksContext`)
- `src/mocks/data/tasks.ts` : 10 tâches non utilisées

---

### 6.2. Notifications Dupliquées

**Dupliquées** :
1. `notificationsStore.tsx` : 6 notifications (utilisées)
2. `suiviMock.ts` : 5 notifications (non utilisées)
3. `notificationsApi.mock.ts` : 5 notifications (utilisées par `api/notifications.ts` mais pas par `NotificationsStore`)
4. `mocks/data/notifications.ts` : 5 notifications (non utilisées)

**Problème** : 4 sources différentes pour les notifications avec des structures différentes.

---

## 7. Proposition : Structure Unifiée `suiviData.ts`

### 7.1. Architecture Proposée

**Fichier unique** : `src/mocks/suiviData.ts`

**Contenu** :
```typescript
// ============================================================================
// SUIVI DATA - SOURCE UNIQUE DE VÉRITÉ
// ============================================================================

import type { Task } from '../api/tasks';

// Types unifiés
export type SuiviNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedTaskId?: string | null;  // Format unifié
  projectId?: string;
  actor?: {
    id?: string;
    name?: string;
    avatarUrl?: string;
  };
};

// ============================================================================
// TÂCHES (8 tâches avec Quick Actions)
// ============================================================================

export const TASKS: Task[] = [
  // ... 8 tâches de suiviMock.ts (IDs: '1', '2', ..., '8')
  // TOUTES avec quickAction
];

// ============================================================================
// NOTIFICATIONS (synchronisées avec TASKS)
// ============================================================================

export const NOTIFICATIONS: SuiviNotification[] = [
  {
    id: 'notif-1',
    type: 'task_assigned',
    title: 'New task assigned',
    message: '...',
    read: false,
    createdAt: '2024-11-16T10:00:00Z',
    relatedTaskId: '1',  // ✅ Format compatible avec TASKS
    actor: { ... },
  },
  // ... autres notifications
  // TOUTES les relatedTaskId utilisent le format des IDs de TASKS ('1', '2', ...)
];

// ============================================================================
// FONCTIONS DE CHARGEMENT
// ============================================================================

export async function loadTasks(): Promise<Task[]> {
  await delay(300);
  return [...TASKS];
}

export async function loadNotifications(): Promise<SuiviNotification[]> {
  await delay(150);
  return [...NOTIFICATIONS];
}
```

---

### 7.2. Avantages

1. ✅ **Source unique** : Un seul fichier pour toutes les données mockées
2. ✅ **IDs cohérents** : Notifications et tâches utilisent le même format d'ID
3. ✅ **Structure unifiée** : Une seule interface `SuiviNotification`
4. ✅ **Synchronisation garantie** : Les `relatedTaskId` correspondent toujours aux IDs de `TASKS`
5. ✅ **Migration simple** : Un seul fichier à remplacer pour l'API réelle

---

## 8. Plan de Migration Minimal

### 8.1. Fichiers à Modifier

#### 1. Créer `src/mocks/suiviData.ts` (nouveau)
- Déplacer les 8 tâches de `suiviMock.ts`
- Déplacer et adapter les 6 notifications de `notificationsStore.tsx`
- Corriger les `relatedTaskId` : 'task-1' → '1', 'task-2' → '2', etc.

#### 2. Modifier `src/mocks/tasks/mockTaskHelpers.ts`
- Changer l'import : `import { TASKS as MOCK_TASKS } from '../suiviData';`

#### 3. Modifier `src/features/notifications/notificationsStore.tsx`
- Changer `INITIAL_NOTIFICATIONS` : `import { NOTIFICATIONS as INITIAL_NOTIFICATIONS } from '../../mocks/suiviData';`

#### 4. Modifier `src/mocks/suiviMock.ts` (optionnel)
- Supprimer les tâches et notifications (déplacées vers `suiviData.ts`)
- Ou garder pour compatibilité avec `services/api.ts`

---

### 8.2. Fichiers à Supprimer (après migration)

1. `src/mocks/tasks/mockTasks.ts` ❌ (obsolète depuis unification)
2. `src/mocks/data/tasks.ts` ❌ (non utilisé)
3. `src/mocks/data/notifications.ts` ❌ (non utilisé)

**Note** : `src/api/tasksApi.mock.ts` et `src/api/notificationsApi.mock.ts` peuvent être gardés pour compatibilité avec `api/tasks.ts` et `api/notifications.ts`.

---

## 9. Validation de Compatibilité Backend

### 9.1. Structure Compatible API

**Tâches** :
```typescript
// Format actuel (suiviMock.ts)
{
  id: string;              // ✅ Compatible API
  title: string;           // ✅ Compatible API
  status: TaskStatus;      // ✅ Compatible API
  dueDate?: string;        // ✅ Compatible API
  quickAction?: {          // ✅ Compatible API (champ backend)
    actionType: string;
    uiHint: string;
    payload?: Record<string, any>;
  };
}

// API Backend Suivi
GET /api/tasks → Task[]
GET /api/tasks/:id → Task
```

**Notifications** :
```typescript
// Format proposé (unifié)
{
  id: string;              // ✅ Compatible API
  type: NotificationType;  // ✅ Compatible API
  relatedTaskId?: string;  // ✅ Compatible API (champ backend)
  // ...
}

// API Backend Suivi
GET /api/notifications → Notification[]
PATCH /api/notifications/:id/read → void
```

### 9.2. Migration Vers API Réelle

**Étapes** :
1. Remplacer `loadTasks()` dans `mockTaskHelpers.ts` par `GET /api/tasks`
2. Remplacer `loadNotifications()` dans `notificationsStore.tsx` par `GET /api/notifications`
3. Garder les mêmes interfaces TypeScript
4. Les écrans n'ont pas besoin de modification

---

## 10. Recommandations Finales

### 10.1. Actions Immédiates

1. ✅ **Corriger les IDs des notifications** dans `notificationsStore.tsx` :
   - Remplacer 'task-1' → '1', 'task-2' → '2', etc.
   - Résout le bug "Task not found"

2. ✅ **Unifier les notifications** :
   - Utiliser `suiviData.ts` comme source unique
   - Supprimer les duplications

### 10.2. Actions Moyen Terme

1. **Créer `suiviData.ts`** avec structure unifiée
2. **Migrer toutes les sources** vers `suiviData.ts`
3. **Supprimer les fichiers obsolètes**

### 10.3. Actions Long Terme

1. **Migration vers API réelle** :
   - Remplacer `suiviData.ts` par appels API
   - Garder les mêmes interfaces

---

## 11. Fichiers du Rapport

### Fichiers Analysés

**Tâches** :
- ✅ `src/mocks/suiviMock.ts` (utilisé)
- ✅ `src/mocks/tasks/mockTasks.ts` (obsolète)
- ✅ `src/mocks/tasks/mockTaskHelpers.ts` (helper)
- ✅ `src/api/tasksApi.mock.ts` (indirect)
- ✅ `src/mocks/data/tasks.ts` (non utilisé)

**Notifications** :
- ✅ `src/features/notifications/notificationsStore.tsx` (utilisé)
- ✅ `src/mocks/suiviMock.ts` (défini mais non utilisé)
- ✅ `src/api/notificationsApi.mock.ts` (indirect)
- ✅ `src/mocks/data/notifications.ts` (non utilisé)

**Contexts et Hooks** :
- ✅ `src/tasks/TasksContext.tsx`
- ✅ `src/tasks/useTaskById.ts`
- ✅ `src/tasks/useTasks.ts`
- ✅ `src/features/notifications/notificationsStore.tsx`

**Écrans** :
- ✅ `src/screens/MyTasksScreen.tsx`
- ✅ `src/screens/TaskDetailScreen.tsx`
- ✅ `src/screens/NotificationsScreen.tsx`
- ✅ `src/components/ui/NotificationItem.tsx`
- ✅ `src/components/ui/TaskItem.tsx`
- ✅ `src/navigation/MainTabNavigator.tsx`

---

## 12. Conclusion

### État Actuel

**Tâches** : ✅ Unifiées (utilisent uniquement `suiviMock.ts`)  
**Notifications** : ❌ Non unifiées (utilisent `notificationsStore.tsx` avec IDs incompatibles)

### Problème Principal

Les notifications référencent des IDs de tâches ('task-1', 'task-2') qui n'existent plus dans `TasksContext` (qui utilise '1', '2', ...).

### Solution Recommandée

1. **Court terme** : Corriger les IDs dans `notificationsStore.tsx`
2. **Moyen terme** : Créer `suiviData.ts` et unifier toutes les sources
3. **Long terme** : Migration vers API réelle via `suiviData.ts`

---

**Rapport généré automatiquement - Aucune modification de code effectuée**

