# Tasks Architecture - Suivi Mobile App

Ce document décrit l'architecture du système de gestion des tâches dans l'application mobile Suivi, et comment connecter l'API Suivi backend.

## Vue d'ensemble

Le système de gestion des tâches utilise un **TasksProvider** (React Context) qui centralise toutes les opérations sur les tâches. Les écrans utilisent exclusivement des **hooks** (`useTasks`, `useTaskById`, `useUpdateTaskStatus`) et ne font jamais d'appels API directs.

**Architecture actuelle** : Store interne avec données mock  
**Architecture future** : Remplacement des mocks par des appels API Suivi

---

## Architecture actuelle (MVP avec mocks)

```
┌─────────────────────────────────────────────────────────────┐
│                      Écrans UI                              │
│  (HomeScreen, MyTasksScreen, TaskDetailScreen)             │
└───────────────────┬─────────────────────────────────────────┘
                    │ utilise
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      Hooks                                  │
│  - useTasks(filter)                                        │
│  - useTaskById(id)                                          │
│  - useUpdateTaskStatus()                                    │
└───────────────────┬─────────────────────────────────────────┘
                    │ appelle
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                  TasksProvider                              │
│  (React Context avec useState/useReducer)                   │
│                                                             │
│  - tasks: Task[]                                            │
│  - getTaskById(id)                                          │
│  - getTasksByStatus(status)                                 │
│  - updateTaskStatus(id, status)                             │
│  - refreshTasks()                                           │
└───────────────────┬─────────────────────────────────────────┘
                    │ utilise
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                  Mocks (src/mocks/tasks/)                   │
│  - mockTasks.ts : Données fictives                          │
│  - mockTaskHelpers.ts : Simule les appels API               │
└─────────────────────────────────────────────────────────────┘
```

---

## Rôle du TasksProvider

Le `TasksProvider` est le **point central** de gestion des tâches dans l'application :

### Fonctionnalités principales

1. **Stockage en mémoire** : Toutes les tâches sont stockées dans un état React (`useState`)
2. **Méthodes de récupération** : `getTaskById()`, `getTasksByStatus()` pour filtrer
3. **Mise à jour optimiste** : `updateTaskStatus()` met à jour l'UI immédiatement, puis synchronise avec le backend
4. **Synchronisation automatique** : Tous les écrans qui utilisent le contexte se mettent à jour automatiquement

### Interface exposée

```typescript
interface TasksContextValue {
  tasks: Task[];                                    // Liste complète
  isLoading: boolean;                               // État de chargement
  error: Error | null;                              // Erreur éventuelle
  getTaskById(id: string): Task | undefined;       // Récupérer une tâche
  getTasksByStatus(status): Task[];                 // Filtrer par statut
  updateTaskStatus(id, status): Promise<void>;      // Mettre à jour le statut
  refreshTasks(): Promise<void>;                    // Rafraîchir la liste
}
```

---

## Hooks disponibles

### `useTasks(filter?)`

Récupère la liste des tâches avec filtres optionnels.

```typescript
const { tasks, isLoading, error, refresh } = useTasks('active');
```

**Filtres disponibles** :
- `'all'` : Toutes les tâches
- `'active'` : Tâches actives (todo, in_progress, blocked)
- `'completed'` : Tâches complétées (done)
- `TaskStatus` spécifique : `'todo'`, `'in_progress'`, `'blocked'`, `'done'`

**Retourne** :
- `tasks: Task[]` - Liste filtrée des tâches
- `isLoading: boolean` - État de chargement
- `error: Error | null` - Erreur éventuelle
- `refresh: () => Promise<void>` - Fonction pour rafraîchir

### `useTaskById(id)`

Récupère une tâche spécifique par son ID.

```typescript
const { task, isLoading, error } = useTaskById('task-1');
```

**Retourne** :
- `task: Task | undefined` - La tâche trouvée ou `undefined`
- `isLoading: boolean` - État de chargement
- `error: Error | null` - Erreur éventuelle

### `useUpdateTaskStatus()`

Hook pour mettre à jour le statut d'une tâche.

```typescript
const { updateStatus, isUpdating } = useUpdateTaskStatus();

await updateStatus('task-1', 'done');
```

**Retourne** :
- `updateStatus(id, status): Promise<void>` - Fonction pour mettre à jour
- `isUpdating: boolean` - État de mise à jour en cours

---

## Comment connecter l'API Suivi

### Étape 1 : Créer le client API

Créer `src/api/tasksClient.ts` qui encapsule les appels HTTP vers l'API Suivi.

```typescript
// src/api/tasksClient.ts
const API_BASE_URL = 'https://api.suivi.app';

export async function apiGetTasks(token: string): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to load tasks');
  const data = await response.json();
  return data.tasks;
}

export async function apiGetTaskById(id: string, token: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to load task');
  return response.json();
}

export async function apiUpdateTaskStatus(
  id: string,
  status: TaskStatus,
  token: string
): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update task status');
  return response.json();
}
```

### Étape 2 : Modifier TasksContext.tsx

Remplacer les appels mock par les appels API réels.

```typescript
// AVANT (mock)
const mockTasks = await loadMockTasks();
setTasks(mockTasks);

// APRÈS (API)
import { apiGetTasks } from '../api/tasksClient';
import { useAuth } from '../auth';

const { accessToken } = useAuth();
const tasks = await apiGetTasks(accessToken);
setTasks(tasks);
```

**Modifications à faire dans `TasksContext.tsx`** :

1. **Dans `loadTasks()`** :
   ```typescript
   const { accessToken } = useAuth(); // Récupérer le token d'authentification
   const tasks = await apiGetTasks(accessToken);
   setTasks(tasks);
   ```

2. **Dans `updateTaskStatus()`** :
   ```typescript
   // Mise à jour optimiste (déjà en place)
   setTasks(prevTasks => ...);
   
   // Appel API réel
   try {
     const { accessToken } = useAuth();
     await apiUpdateTaskStatus(id, newStatus, accessToken);
     // Si succès, la tâche est déjà mise à jour dans l'état local
   } catch (error) {
     // Rollback en cas d'erreur
     await loadTasks();
     throw error;
   }
   ```

### Étape 3 : Ajouter react-query (optionnel mais recommandé)

Pour améliorer la gestion du cache et la synchronisation automatique, on peut ajouter React Query autour du provider.

```typescript
// src/tasks/TasksContext.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function TasksProvider({ children }: TasksProviderProps) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  // Query pour charger les tâches
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiGetTasks(accessToken),
    enabled: !!accessToken,
  });

  // Mutation pour mettre à jour le statut
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      apiUpdateTaskStatus(id, status, accessToken),
    onMutate: async ({ id, status }) => {
      // Mise à jour optimiste
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], (old) =>
        old?.map((task) => (task.id === id ? { ...task, status } : task))
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      // Rafraîchir après succès
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // ... reste du code
}
```

### Étape 4 : Désactiver les mocks

Une fois que l'API Suivi est connectée, supprimer ou commenter les imports de mocks dans `TasksContext.tsx` :

```typescript
// AVANT
import { loadMockTasks, updateMockTaskStatus } from '../mocks/tasks/mockTaskHelpers';

// APRÈS
// import { loadMockTasks, updateMockTaskStatus } from '../mocks/tasks/mockTaskHelpers';
// Les mocks ne sont plus utilisés, on peut les supprimer du build
```

---

## Mapping API Suivi → Moteur local

### Endpoints attendus

| Action | Endpoint | Méthode | Request Body | Response |
|--------|----------|---------|--------------|----------|
| Lister les tâches | `/api/tasks` | GET | - | `{ tasks: Task[] }` |
| Récupérer une tâche | `/api/tasks/:id` | GET | - | `Task` |
| Mettre à jour le statut | `/api/tasks/:id/status` | PATCH | `{ status: TaskStatus }` | `Task` |

### Format des données

Les types `Task` et `TaskStatus` doivent correspondre exactement à ceux définis dans `src/tasks/tasks.types.ts` :

```typescript
type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;        // Format: YYYY-MM-DD
  projectId?: string;
  projectName?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  createdAt: string;       // Format: ISO 8601
  updatedAt: string;       // Format: ISO 8601
}
```

---

## Diagramme de flux

### Flux actuel (MVP avec mocks)

```
HomeScreen
  ↓ utilise useTasks('active')
useTasks Hook
  ↓ appelle getTasksByStatus('active')
TasksProvider
  ↓ filtre depuis tasks[] (mock)
Mock Data (MOCK_TASKS)
```

### Flux futur (avec API Suivi)

```
HomeScreen
  ↓ utilise useTasks('active')
useTasks Hook
  ↓ appelle getTasksByStatus('active')
TasksProvider
  ↓ charge depuis API
API Suivi (GET /api/tasks)
  ↓ retourne Task[]
TasksProvider (mise à jour tasks[])
  ↓ propagation automatique
HomeScreen (re-render avec nouvelles données)
```

---

## Synchronisation UI immédiate

Le système garantit une **synchronisation UI immédiate** grâce à la mise à jour optimiste :

1. **User action** : L'utilisateur change le statut d'une tâche dans `TaskDetailScreen`
2. **Optimistic update** : `TasksProvider.updateTaskStatus()` met à jour immédiatement l'état local
3. **UI update** : Tous les écrans (HomeScreen, MyTasksScreen, TaskDetailScreen) se mettent à jour automatiquement
4. **API call** : L'appel API Suivi est fait en arrière-plan
5. **On error** : Si l'API échoue, rollback automatique vers l'état précédent

---

## Structure des fichiers

```
src/
├── tasks/
│   ├── TasksContext.tsx        → Provider principal
│   ├── useTasks.ts             → Hook liste + filtres
│   ├── useTaskById.ts          → Hook pour un détail
│   ├── useUpdateTaskStatus.ts  → Hook mutation
│   └── tasks.types.ts          → Types normalisés
├── mocks/
│   └── tasks/
│       ├── mockTasks.ts        → Données fictives
│       └── mockTaskHelpers.ts  → Simule les appels API
└── api/
    └── tasksClient.ts          → (À créer) Client API Suivi
```

---

## Vérifications après migration API

Une fois que l'API Suivi est connectée, vérifier :

1. ✅ Les tâches se chargent depuis l'API au démarrage
2. ✅ Les filtres fonctionnent correctement
3. ✅ La mise à jour de statut synchronise avec le backend
4. ✅ Le rollback fonctionne en cas d'erreur API
5. ✅ La synchronisation UI est toujours immédiate
6. ✅ Les écrans se mettent à jour automatiquement
7. ✅ Les états de chargement et d'erreur sont gérés correctement

---

## Documentation complémentaire

- `docs/mobile/tasks-api-contract.md` : Contrat d'API détaillé
- `src/tasks/tasks.types.ts` : Types TypeScript
- `src/tasks/TasksContext.tsx` : Code source du provider


