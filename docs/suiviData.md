# Suivi Data - Source Unique de Vérité

**Fichier** : `src/mocks/suiviData.ts`  
**Date** : 2024-11-16  
**Statut** : Source unique de vérité pour toutes les données mockées

---

## Vue d'ensemble

`suiviData.ts` centralise **toutes** les données mockées pour le MVP Suivi mobile :
- ✅ **Tâches** (8 tâches avec Quick Actions)
- ✅ **Notifications** (6 notifications liées aux tâches)

Ce fichier est la **seule source de vérité** pour les données mockées. Tous les contexts et helpers chargent leurs données depuis ce fichier.

---

## Structure

### 1. Types

#### `NotificationType`
Types de notifications orientées "sollicitations utilisateur" uniquement :
- `task_assigned` : Nouvelle tâche assignée
- `mention_in_comment` : Mention dans un commentaire
- `comment` : Commentaire sur ma tâche
- `status_changed` : Statut changé sur ma tâche
- `task_due_today` : Tâche due aujourd'hui
- `task_overdue` : Tâche en retard

#### `SuiviNotification`
Structure unifiée pour les notifications :
```typescript
export type SuiviNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO string
  relatedTaskId?: string | null; // ID de la tâche liée - DOIT correspondre à un ID de TASKS
  projectId?: string;
  actor?: {
    id?: string;
    name?: string;
    avatarUrl?: string;
  };
};
```

### 2. Données

#### `TASKS: Task[]`
**8 tâches** avec Quick Actions.

**Format des IDs** : Strings numériques `'1'`, `'2'`, `'3'`, ..., `'8'` (compatible API backend).

**Exemple de tâche** :
```typescript
{
  id: '1',
  title: 'Répondre à un commentaire sur le design system',
  status: 'in_progress',
  dueDate: '2024-11-20',
  projectName: 'Mobile App',
  assigneeName: 'Julien',
  updatedAt: '2024-11-16T10:00:00Z',
  quickAction: {
    actionType: "COMMENT",
    uiHint: "comment_input",
  },
}
```

**Quick Actions disponibles** :
- `COMMENT` (comment_input)
- `APPROVAL` (approval_dual_button)
- `RATING` (stars_1_to_5)
- `PROGRESS` (stars_1_to_5) - ⚠️ Désactivée actuellement
- `WEATHER` (weather_picker)
- `CALENDAR` (calendar_picker)
- `CHECKBOX` (simple_checkbox)
- `SELECT` (dropdown_select)

#### `NOTIFICATIONS: SuiviNotification[]`
**6 notifications** liées aux tâches.

**Format des IDs** : `'notif-1'`, `'notif-2'`, ..., `'notif-6'`.

**Format des `relatedTaskId`** : Strings numériques `'1'`, `'2'`, ..., `'8'` qui correspondent **EXACTEMENT** aux IDs des tâches dans `TASKS`.

**Exemple de notification** :
```typescript
{
  id: 'notif-1',
  type: 'task_assigned',
  title: 'New task assigned',
  message: 'You have been assigned to "Répondre à un commentaire sur le design system"',
  read: false,
  createdAt: '2024-11-16T10:00:00Z',
  relatedTaskId: '1', // ✅ Pointe vers TASKS[0] (id: '1')
  actor: {
    id: 'user-admin',
    name: 'Sarah Martin',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
}
```

### 3. Fonctions de chargement

#### `loadTasks(): Promise<Task[]>`
Charge toutes les tâches mockées (simule un délai réseau de 300ms).

**Usage** :
```typescript
import { loadTasks } from '../mocks/suiviData';

const tasks = await loadTasks();
```

**TODO** : Remplacer par `GET /api/tasks` avec authentification.

#### `loadNotifications(): Promise<SuiviNotification[]>`
Charge toutes les notifications mockées (simule un délai réseau de 150ms).

**Usage** :
```typescript
import { loadNotifications } from '../mocks/suiviData';

const notifications = await loadNotifications();
```

**TODO** : Remplacer par `GET /api/notifications` avec authentification.

#### `validateDataIntegrity(): { valid: boolean; errors: string[] }`
Valide que toutes les notifications pointent vers des tâches existantes.

**Usage** (développement uniquement) :
```typescript
import { validateDataIntegrity } from '../mocks/suiviData';

const { valid, errors } = validateDataIntegrity();
if (!valid) {
  console.error('Data integrity errors:', errors);
}
```

---

## Règles de Cohérence ID

### ⚠️ RÈGLE CRITIQUE : Format des IDs

1. **Tâches** : IDs sont des **strings numériques** : `'1'`, `'2'`, `'3'`, etc.
   - ✅ **CORRECT** : `id: '1'`
   - ❌ **INCORRECT** : `id: 'task-1'`

2. **Notifications** : `relatedTaskId` **DOIT** correspondre **EXACTEMENT** aux IDs des tâches.
   - ✅ **CORRECT** : `relatedTaskId: '1'` (si la tâche a `id: '1'`)
   - ❌ **INCORRECT** : `relatedTaskId: 'task-1'`

3. **Aucune notification ne doit pointer vers une tâche inexistante**.
   - Si une notification a `relatedTaskId: '1'`, alors `TASKS` **DOIT** contenir une tâche avec `id: '1'`.

### Exemple de mapping correct

```typescript
// TASKS
{
  id: '1',  // ✅ Format numérique
  title: 'Répondre à un commentaire...',
  // ...
}

// NOTIFICATIONS
{
  id: 'notif-1',
  relatedTaskId: '1',  // ✅ Correspond exactement à TASKS[0].id
  // ...
}
```

---

## Liens entre Tâches et Notifications

### Mapping actuel

| Notification | relatedTaskId | Tâche | ID Tâche | Description |
|-------------|---------------|-------|----------|-------------|
| `notif-1` | `'1'` | Répondre à un commentaire... | `'1'` | ✅ Tâche assignée |
| `notif-2` | `'4'` | Marquer la progression... | `'4'` | ✅ Commentaire |
| `notif-3` | `'2'` | Approuver ou refuser... | `'2'` | ✅ Mention |
| `notif-4` | `'2'` | Approuver ou refuser... | `'2'` | ✅ Statut changé |
| `notif-5` | `'1'` | Répondre à un commentaire... | `'1'` | ✅ Due today |
| `notif-6` | `'7'` | Cocher les étapes... | `'7'` | ✅ Overdue |

**Toutes les notifications pointent vers des tâches existantes** ✅

---

## Utilisation dans l'Application

### TasksContext

**Fichier** : `src/mocks/tasks/mockTaskHelpers.ts`

```typescript
import { loadTasks, TASKS as MOCK_TASKS } from '../suiviData';

export async function loadMockTasks(): Promise<Task[]> {
  // Utilise loadTasks() depuis suiviData.ts
  const tasks = await loadTasks();
  return tasks;
}
```

**Flux** :
```
TasksProvider
  └─ TasksContext.tsx
      └─ loadTasks()
          └─ mockTaskHelpers.ts::loadMockTasks()
              └─ suiviData.ts::loadTasks() ✅
                  └─ TASKS
```

### NotificationsStore

**Fichier** : `src/features/notifications/notificationsStore.tsx`

```typescript
import { loadNotifications, type SuiviNotification } from '../../mocks/suiviData';

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadInitialNotifications = async () => {
      const loadedNotifications = await loadNotifications();
      setNotifications(loadedNotifications);
    };
    loadInitialNotifications();
  }, []);
}
```

**Flux** :
```
NotificationsProvider
  └─ notificationsStore.tsx
      └─ useEffect
          └─ loadNotifications() ✅
              └─ suiviData.ts::NOTIFICATIONS
```

### Navigation depuis Notifications

**Fichier** : `src/components/ui/NotificationItem.tsx`

```typescript
const handleNotificationClick = () => {
  const taskId = notification.relatedTaskId; // Ex: '1'
  
  // Vérifier que la tâche existe
  const task = getTaskByIdStrict(taskId);
  if (!task) {
    Alert.alert('Tâche introuvable');
    return;
  }
  
  // Navigation vers TaskDetailScreen
  navigation.navigate('TaskDetail', { taskId });
};
```

**Flux** :
```
NotificationItem::handleNotificationClick()
  └─ notification.relatedTaskId  // '1', '2', etc.
      └─ TasksContext::getTaskByIdStrict('1') ✅
          └─ TASKS.find(task => task.id === '1') ✅
              └─ Navigation vers TaskDetailScreen
```

---

## Migration Vers API Réelle

### Étapes de Migration

#### 1. Remplacer `loadTasks()`

**Avant (mock)** :
```typescript
export async function loadTasks(): Promise<Task[]> {
  await delay(300);
  return [...TASKS];
}
```

**Après (API réelle)** :
```typescript
import { apiFetch } from '../api/client';

export async function loadTasks(accessToken: string): Promise<Task[]> {
  return apiFetch<Task[]>('/api/tasks', {}, accessToken);
}
```

#### 2. Remplacer `loadNotifications()`

**Avant (mock)** :
```typescript
export async function loadNotifications(): Promise<SuiviNotification[]> {
  await delay(150);
  return [...NOTIFICATIONS];
}
```

**Après (API réelle)** :
```typescript
import { apiFetch } from '../api/client';

export async function loadNotifications(accessToken: string): Promise<SuiviNotification[]> {
  return apiFetch<SuiviNotification[]>('/api/notifications', {}, accessToken);
}
```

#### 3. Adapter les contexts

**mockTaskHelpers.ts** :
```typescript
// Avant
import { loadTasks } from '../suiviData';
export async function loadMockTasks(): Promise<Task[]> {
  return await loadTasks();
}

// Après
import { loadTasks } from '../suiviData';
export async function loadMockTasks(accessToken: string): Promise<Task[]> {
  return await loadTasks(accessToken);
}
```

**notificationsStore.tsx** :
```typescript
// Avant
const loadedNotifications = await loadNotifications();

// Après
const loadedNotifications = await loadNotifications(accessToken);
```

### Structure API Backend Attendue

#### GET /api/tasks
**Réponse** :
```json
[
  {
    "id": "1",
    "title": "Répondre à un commentaire sur le design system",
    "status": "in_progress",
    "dueDate": "2024-11-20",
    "projectName": "Mobile App",
    "assigneeName": "Julien",
    "updatedAt": "2024-11-16T10:00:00Z",
    "quickAction": {
      "actionType": "COMMENT",
      "uiHint": "comment_input"
    }
  },
  ...
]
```

#### GET /api/notifications
**Réponse** :
```json
[
  {
    "id": "notif-1",
    "type": "task_assigned",
    "title": "New task assigned",
    "message": "You have been assigned to \"...\"",
    "read": false,
    "createdAt": "2024-11-16T10:00:00Z",
    "relatedTaskId": "1",
    "actor": {
      "id": "user-admin",
      "name": "Sarah Martin",
      "avatarUrl": "https://..."
    }
  },
  ...
]
```

### Points d'Attention

1. **IDs** : Les IDs retournés par l'API doivent être des strings numériques (`'1'`, `'2'`, etc.).
2. **RelatedTaskId** : Les `relatedTaskId` des notifications doivent correspondre aux IDs des tâches.
3. **Types** : Les types TypeScript (`Task`, `SuiviNotification`) doivent rester identiques.
4. **Structure QuickAction** : La structure `quickAction` doit rester identique.

---

## Fichiers Obsolètes

Les fichiers suivants sont **obsolètes** et ne doivent plus être utilisés :

- ❌ `src/mocks/tasks/mockTasks.ts` : Anciennes tâches (16 tâches, format 'task-1', pas de quickAction)
- ❌ `src/mocks/data/tasks.ts` : Anciennes tâches (non utilisé)
- ❌ `src/mocks/data/notifications.ts` : Anciennes notifications (non utilisé)

**Note** : Ces fichiers sont conservés pour référence mais marqués comme obsolètes. Ils peuvent être supprimés après vérification.

**Fichiers conservés** (utilisés par `api/tasks.ts` et `api/notifications.ts`) :
- ✅ `src/api/tasksApi.mock.ts` : Utilisé par `api/tasks.ts` (si `USE_MOCK_API = true`)
- ✅ `src/api/notificationsApi.mock.ts` : Utilisé par `api/notifications.ts` (si `USE_MOCK_API = true`)

---

## Validation

### Valider l'intégrité des données

Appeler `validateDataIntegrity()` au démarrage (développement uniquement) :

```typescript
import { validateDataIntegrity } from '../mocks/suiviData';

// Dans App.tsx ou un fichier de développement
const { valid, errors } = validateDataIntegrity();
if (!valid) {
  console.error('Data integrity errors:', errors);
}
```

Cette fonction vérifie que :
- ✅ Toutes les notifications pointent vers des tâches existantes
- ✅ Les `relatedTaskId` correspondent aux IDs des tâches

---

## Exemples d'Utilisation

### Ajouter une nouvelle tâche

```typescript
// Dans suiviData.ts
export const TASKS: Task[] = [
  // ... tâches existantes
  {
    id: '9',  // ✅ Format numérique
    title: 'Nouvelle tâche',
    status: 'todo',
    dueDate: '2024-11-30',
    projectName: 'Mobile App',
    assigneeName: 'Julien',
    updatedAt: '2024-11-16T12:00:00Z',
    quickAction: {
      actionType: "COMMENT",
      uiHint: "comment_input",
    },
  },
];
```

### Ajouter une nouvelle notification

```typescript
// Dans suiviData.ts
export const NOTIFICATIONS: SuiviNotification[] = [
  // ... notifications existantes
  {
    id: 'notif-7',
    type: 'task_assigned',
    title: 'New task assigned',
    message: 'You have been assigned to "Nouvelle tâche"',
    read: false,
    createdAt: '2024-11-16T12:00:00Z',
    relatedTaskId: '9',  // ✅ Doit correspondre à TASKS[8].id
    actor: {
      id: 'user-admin',
      name: 'Sarah Martin',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
    },
  },
];
```

**⚠️ IMPORTANT** : Vérifier avec `validateDataIntegrity()` après ajout.

---

## Résumé

- ✅ **Source unique** : `suiviData.ts` est la seule source de vérité
- ✅ **IDs cohérents** : Format numérique '1', '2', etc. partout
- ✅ **Liens valides** : Toutes les notifications pointent vers des tâches existantes
- ✅ **Migration simple** : Un seul fichier à remplacer pour l'API réelle
- ✅ **Validation** : Fonction `validateDataIntegrity()` pour détecter les erreurs

---

**Documentation générée automatiquement - Dernière mise à jour : 2024-11-16**

