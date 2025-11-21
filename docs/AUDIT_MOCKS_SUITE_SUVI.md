# Audit Complet des Sources Mockées - Suite Suivi Mobile

**Date** : 2024-11-16  
**Objectif** : Diagnostic complet de la mécanique tâches/notifications/navigation pour intégration API  
**Statut** : Après unification vers `suiviData.ts`

---

## A. Résumé Exécutif

### Problèmes Majeurs Identifiés

1. **✅ UNIFICATION RÉCENTE** : `suiviData.ts` est la nouvelle source unique de vérité, mais des sources obsolètes persistent
2. **⚠️ SOURCES PARALLÈLES** : `suiviMock.ts` et `api/tasksApi.mock.ts` coexistent avec des données différentes
3. **✅ IDs COHÉRENTS** : Après unification, tous les IDs sont au format numérique '1', '2', etc.
4. **✅ NAVIGATION FONCTIONNELLE** : NotificationItem utilise `getTaskByIdStrict()` avec vérification préalable
5. **⚠️ DUPLICATIONS** : 4 sources de tâches, 4 sources de notifications avec structures différentes

### Conclusions Clés

| Point | Statut | Impact |
|-------|--------|--------|
| **Source active (TasksContext)** | ✅ `suiviData.ts` | Utilisée par l'app runtime |
| **Source active (NotificationsStore)** | ✅ `suiviData.ts` | Utilisée par l'app runtime |
| **IDs cohérents** | ✅ '1', '2', etc. | Navigation fonctionnelle |
| **QuickActions présentes** | ✅ 8/8 tâches | MVP fonctionnel |
| **Sources obsolètes** | ⚠️ 3 fichiers | Risque de confusion |
| **Sources parallèles** | ⚠️ `suiviMock.ts`, `tasksApi.mock.ts` | Utilisées par `services/api.ts` |

### Risques Identifiés

- **Risque faible** : Duplication de données entre `suiviData.ts` et `suiviMock.ts` (même contenu mais formats différents)
- **Risque moyen** : `tasksApi.mock.ts` contient 10 tâches sans `quickAction` (potentiellement utilisées par `api/tasks.ts`)
- **Risque faible** : Fichiers obsolètes marqués mais non supprimés (risque de réutilisation accidentelle)

### Impact

- **Navigation** : ✅ Fonctionnelle après unification
- **QuickActions** : ✅ Toutes présentes dans `suiviData.ts`
- **Cohérence IDs** : ✅ Format uniforme '1'-'8'
- **Migration API** : ⚠️ 2 chemins possibles (`suiviData.ts` ou `suiviMock.ts` via `services/api.ts`)

---

## B. Cartographie Complète des Sources

### B.1. Sources de Tâches

#### 1. `src/mocks/suiviData.ts` ✅ **ACTIVE (Runtime)**

**Statut** : Source unique de vérité utilisée par TasksContext  
**Export** : `export const TASKS: Task[]`  
**Nombre** : 8 tâches  
**IDs** : '1', '2', '3', '4', '5', '6', '7', '8' (format numérique)  
**QuickAction** : ✅ Oui (8/8 tâches)  
**Utilisé par** : `TasksContext` → `mockTaskHelpers.ts::loadMockTasks()` → `loadTasks()`

**Structure** :
```typescript
{
  id: '1',  // Format numérique
  title: string,
  status: TaskStatus,
  dueDate: string,
  projectName: string,
  assigneeName: string,
  updatedAt: string,
  quickAction: {  // ✅ Présent sur toutes les tâches
    actionType: "COMMENT" | "APPROVAL" | ...,
    uiHint: string,
    payload?: Record<string, any>
  }
}
```

**Chargement** :
- `TasksContext.tsx::loadTasks()` → `mockTaskHelpers.ts::loadMockTasks()` → `suiviData.ts::loadTasks()` → `TASKS`

**Fonctions exportées** :
- `loadTasks(): Promise<Task[]>` : Charge toutes les tâches (délai 300ms)
- `validateDataIntegrity()` : Valide la cohérence des données

---

#### 2. `src/mocks/suiviMock.ts` ⚠️ **PARALLÈLE (services/api.ts)**

**Statut** : Utilisé par `services/api.ts` mais non par TasksContext  
**Export** : `export const tasks: Task[]`  
**Nombre** : 8 tâches  
**IDs** : '1', '2', '3', '4', '5', '6', '7', '8' (format numérique, identique à suiviData.ts)  
**QuickAction** : ✅ Oui (8/8 tâches, contenu identique à suiviData.ts)  
**Utilisé par** : `services/api.ts` (indirect via hooks qui utilisent `api.getTasks()`)

**Structure** : Identique à `suiviData.ts`

**Fonctions exportées** :
- `getTasks(params): Promise<MyTasksPage>` : Avec pagination et filtres
- `getTaskById(taskId): Promise<Task>` : Récupère une tâche par ID
- `getNotifications(): Promise<Notification[]>` : Charge les notifications (structure différente)

**Note** : Contenu identique à `suiviData.ts` mais format d'export différent (fonctions vs constantes)

---

#### 3. `src/api/tasksApi.mock.ts` ⚠️ **PARALLÈLE (api/tasks.ts)**

**Statut** : Utilisé par `api/tasks.ts` si `USE_MOCK_API = true`  
**Export** : `let MOCK_TASKS: Task[]` (interne, non exporté)  
**Nombre** : 10 tâches  
**IDs** : '1', '2', ..., '10' (format numérique, mais IDs '9' et '10' n'existent pas dans suiviData.ts)  
**QuickAction** : ❌ Non (0/10 tâches)  
**Utilisé par** : `api/tasks.ts` → `getMyTasks()` si `USE_MOCK_API = true`

**Structure** :
```typescript
{
  id: '1',
  title: string,
  status: TaskStatus,
  dueDate: string,
  projectName: string,
  assigneeName: string,
  updatedAt: string,
  description?: string,  // Présent ici
  // ❌ Pas de quickAction
}
```

**Fonctions exportées** :
- `getMyTasks(filter): Promise<Task[]>` : Avec filtres 'all' | 'active' | 'completed'
- `getTaskById(id): Promise<Task | undefined>`
- `updateTaskStatus(id, status): Promise<Task>`
- `getMyPriorities(): Promise<Task[]>`
- `getDueSoon(): Promise<Task[]>`
- `getRecentlyUpdated(): Promise<Task[]>`
- `getLate(): Promise<Task[]>`
- `quickCapture(text): Promise<Task>`

**Problème** : 10 tâches sans `quickAction`, mais TasksContext n'utilise pas cette source

---

#### 4. `src/mocks/tasks/mockTasks.ts` ❌ **OBSOLÈTE**

**Statut** : Obsolète depuis unification (marqué comme obsolète)  
**Export** : `export const MOCK_TASKS: Task[]`  
**Nombre** : 16 tâches  
**IDs** : 'task-1', 'task-2', ..., 'task-16' (format avec préfixe "task-")  
**QuickAction** : ❌ Non  
**Utilisé par** : Personne (anciennement utilisé par TasksContext)

**Structure** :
```typescript
{
  id: 'task-1',  // ⚠️ Format incompatible
  title: string,
  description: string,
  status: TaskStatus,
  dueDate: string,
  projectId: string,
  projectName: string,
  assigneeName: string,
  assigneeInitials: string,
  createdAt: string,
  updatedAt: string,
  // ❌ Pas de quickAction
}
```

**Note** : Fichier marqué obsolète mais non supprimé. IDs incompatibles avec l'app actuelle.

---

#### 5. `src/mocks/data/tasks.ts` ❌ **OBSOLÈTE**

**Statut** : Obsolète depuis unification (marqué comme obsolète)  
**Export** : `let MOCK_TASKS: Task[]` (interne, non exporté)  
**Nombre** : 10 tâches  
**IDs** : '1', '2', ..., '10' (format numérique)  
**QuickAction** : ❌ Non  
**Utilisé par** : Personne

**Note** : Fichier marqué obsolète mais non supprimé. Structure similaire à `tasksApi.mock.ts`.

---

### B.2. Sources de Notifications

#### 1. `src/mocks/suiviData.ts` ✅ **ACTIVE (Runtime)**

**Statut** : Source unique de vérité utilisée par NotificationsStore  
**Export** : `export const NOTIFICATIONS: SuiviNotification[]`  
**Nombre** : 6 notifications  
**IDs** : 'notif-1', 'notif-2', ..., 'notif-6'  
**RelatedTaskId** : '1', '2', '4', '7' (format numérique, compatible avec TASKS)  
**Utilisé par** : `NotificationsStore` → `loadNotifications()`

**Structure** :
```typescript
{
  id: 'notif-1',
  type: NotificationType,
  title: string,
  message: string,
  read: boolean,
  createdAt: string,
  relatedTaskId: '1',  // ✅ Format compatible avec TASKS
  projectId?: string,
  actor?: {
    id?: string,
    name?: string,
    avatarUrl?: string
  }
}
```

**Fonctions exportées** :
- `loadNotifications(): Promise<SuiviNotification[]>` : Charge toutes les notifications (délai 150ms)

**Validation** :
- ✅ Tous les `relatedTaskId` correspondent à des IDs de TASKS
- ✅ Format unifié avec `relatedTaskId` (pas `relatedId` ni `taskId`)

---

#### 2. `src/features/notifications/notificationsStore.tsx` ✅ **ACTIVE (Runtime)**

**Statut** : Store React Context qui charge depuis `suiviData.ts`  
**Import** : `import { loadNotifications } from '../../mocks/suiviData'`  
**Nombre** : 6 notifications (chargées via `loadNotifications()`)  
**IDs** : 'notif-1', 'notif-2', ..., 'notif-6' (identiques à suiviData.ts)  
**RelatedTaskId** : '1', '2', '4', '7' (identiques à suiviData.ts)  
**Utilisé par** : `NotificationsScreen`, `MainTabNavigator` (badge), `NotificationItem`

**Structure** :
- Type `Notification = SuiviNotification` (alias)
- Type `NotificationType` importé depuis `suiviData.ts`

**Fonctions** :
- `markAsRead(id: string): void` : Met à jour l'état local (TODO: API call)
- `markAllAsRead(): void` : Met à jour l'état local (TODO: API call)

**Chargement** :
- `NotificationsProvider` → `useEffect` → `loadNotifications()` → `suiviData.ts::NOTIFICATIONS`

---

#### 3. `src/mocks/suiviMock.ts` ⚠️ **PARALLÈLE (services/api.ts)**

**Statut** : Utilisé par `services/api.ts` mais non par NotificationsStore  
**Export** : `const MOCK_NOTIFICATIONS: Notification[]` (interne)  
**Nombre** : 5 notifications  
**IDs** : '1', '2', '3', '4', '5' (format numérique simple)  
**RelatedId** : '1', '2', '3', '4' (format numérique, mais structure différente)  
**Utilisé par** : `services/api.ts::api.getNotifications()` (indirect)

**Structure** :
```typescript
{
  id: '1',  // ⚠️ Format différent (numérique vs 'notif-1')
  type: 'task_assigned' | 'task_completed' | ...,
  title: string,
  message: string,
  read: boolean,
  createdAt: string,
  relatedId: '1',  // ⚠️ Nom différent : relatedId vs relatedTaskId
  relatedType: 'task' | 'project'  // ⚠️ Champ supplémentaire
}
```

**Problème** : Structure différente de `suiviData.ts` (pas d'`actor`, pas de `relatedTaskId`)

---

#### 4. `src/api/notificationsApi.mock.ts` ⚠️ **PARALLÈLE (api/notifications.ts)**

**Statut** : Utilisé par `api/notifications.ts` si `USE_MOCK_API = true`  
**Export** : `let MOCK_NOTIFICATIONS: Notification[]` (interne, non exporté)  
**Nombre** : 5 notifications  
**IDs** : '1', '2', '3', '4', '5' (format numérique simple)  
**TaskId** : '1', '2', '3', '4' (format numérique)  
**Utilisé par** : `api/notifications.ts::getNotifications()` si `USE_MOCK_API = true`

**Structure** :
```typescript
{
  id: '1',
  type: 'task_assigned' | ...,
  title: string,
  message: string,
  read: boolean,
  createdAt: string,
  taskId: '1',  // ⚠️ Nom différent : taskId vs relatedTaskId
  projectId?: string
}
```

**Problème** : Structure différente de `suiviData.ts` (pas d'`actor`, nom de champ différent)

---

#### 5. `src/mocks/data/notifications.ts` ❌ **OBSOLÈTE**

**Statut** : Obsolète depuis unification (marqué comme obsolète)  
**Export** : `let MOCK_NOTIFICATIONS: Notification[]` (interne, non exporté)  
**Nombre** : 5 notifications  
**IDs** : '1', '2', '3', '4', '5'  
**RelatedId** : '1', '2', '3', '4'  
**Utilisé par** : Personne

**Note** : Fichier marqué obsolète mais non supprimé. Structure similaire à `suiviMock.ts`.

---

### B.3. Tableau Synthétique des Sources

| Source | Type | Nombre | IDs | QuickAction | RelatedTaskId | Utilisé par | Statut |
|--------|------|--------|-----|-------------|---------------|-------------|--------|
| **suiviData.ts** | Tâches | 8 | '1'-'8' | ✅ 8/8 | N/A | TasksContext | ✅ ACTIVE |
| **suiviData.ts** | Notifications | 6 | 'notif-1'-'notif-6' | N/A | '1', '2', '4', '7' | NotificationsStore | ✅ ACTIVE |
| **suiviMock.ts** | Tâches | 8 | '1'-'8' | ✅ 8/8 | N/A | services/api.ts | ⚠️ PARALLÈLE |
| **suiviMock.ts** | Notifications | 5 | '1'-'5' | N/A | relatedId: '1'-'4' | services/api.ts | ⚠️ PARALLÈLE |
| **tasksApi.mock.ts** | Tâches | 10 | '1'-'10' | ❌ 0/10 | N/A | api/tasks.ts | ⚠️ PARALLÈLE |
| **notificationsApi.mock.ts** | Notifications | 5 | '1'-'5' | N/A | taskId: '1'-'4' | api/notifications.ts | ⚠️ PARALLÈLE |
| **mockTasks.ts** | Tâches | 16 | 'task-1'-'task-16' | ❌ 0/16 | N/A | Personne | ❌ OBSOLÈTE |
| **data/tasks.ts** | Tâches | 10 | '1'-'10' | ❌ 0/10 | N/A | Personne | ❌ OBSOLÈTE |
| **data/notifications.ts** | Notifications | 5 | '1'-'5' | N/A | relatedId: '1'-'4' | Personne | ❌ OBSOLÈTE |

---

## C. Flux de Données Réels (Runtime)

### C.1. Flux des Tâches

#### Chemin Principal : TasksContext (src/tasks/TasksContext.tsx) ✅ ACTIF

```
App.tsx
  └─ TasksProvider (src/tasks/TasksContext.tsx)  [ligne 64]
      └─ TasksContext.tsx
          └─ loadTasks() [ligne 74]
              └─ mockTaskHelpers.ts::loadMockTasks() [ligne 25]
                  └─ suiviData.ts::loadTasks() [ligne 320]
                      └─ return [...TASKS]  // 8 tâches avec quickAction
                          └─ setTasks(mockTasks)  [TasksContext ligne 87]
                              └─ useTasks(filter)  [MyTasksScreen ligne 46]
                                  └─ MyTasksScreen::visibleTasks
                              └─ useTaskById(taskId)  [TaskDetailScreen ligne 49]
                                  └─ TaskDetailScreen::task
```

**Source finale** : `src/mocks/suiviData.ts::TASKS` (8 tâches, IDs '1'-'8', avec quickAction)  
**Chargé par** : `TasksContext` (src/tasks/TasksContext.tsx) au démarrage via `useEffect`  
**Utilisé par** :
- `MyTasksScreen` : Liste filtrée via `useTasks(filter)` → `TasksContext::getTasksByStatus()`
- `TaskDetailScreen` : Tâche unique via `useTaskById(taskId)` → `TasksContext::getTaskById()`
- `TaskItem` : Affichage dans la liste (QuickActionPreview)

#### Chemin Secondaire : services/api.ts (utilisé par useSuiviQuery.ts) ⚠️ PARALLÈLE

```
hooks/useSuiviQuery.ts::useTasks()
  └─ services/api.ts::api.getTasks()
      └─ suiviMock.ts::getTasks()
          └─ return MyTasksPage { items: tasks, ... }  // 8 tâches depuis suiviMock.ts
```

**Source finale** : `src/mocks/suiviMock.ts::tasks` (8 tâches, identiques à suiviData.ts)  
**Chargé par** : `useSuiviQuery.ts` via React Query (si utilisé)  
**Utilisé par** : Potentiellement certains hooks React Query (mais non utilisé par l'app principale)

**Note** : Ce chemin n'est pas utilisé par les écrans principaux (MyTasksScreen, TaskDetailScreen utilisent TasksContext).

#### Chemin Obsolète : contexts/TasksContext.tsx ❌ NON UTILISÉ

```
contexts/TasksContext.tsx (ancien contexte)
  └─ tasksApi.mock.ts::getMyTasks()
      └─ return MOCK_TASKS  // 10 tâches sans quickAction
```

**Source finale** : `src/api/tasksApi.mock.ts::MOCK_TASKS` (10 tâches, sans quickAction)  
**Chargé par** : Ancien contexte non utilisé par l'app  
**Note** : Ce fichier existe mais n'est pas monté dans `App.tsx` (utilise `src/tasks/TasksContext.tsx` à la place).

---

### C.2. Flux des Notifications

```
App.tsx
  └─ NotificationsProvider
      └─ notificationsStore.tsx
          └─ useEffect [ligne 112]
              └─ loadNotifications()  [ligne 116]
                  └─ suiviData.ts::loadNotifications() [ligne 335]
                      └─ return [...NOTIFICATIONS]  // 6 notifications
                          └─ setNotifications(loadedNotifications)  [ligne 117]
                              └─ useNotificationsStore()  [NotificationsScreen ligne 43]
                                  └─ NotificationsScreen::notifications
                              └─ useNotificationsStore()  [MainTabNavigator ligne 90]
                                  └─ MainTabNavigator::unreadCount (badge)
                              └─ useNotificationsStore()  [NotificationItem ligne 11]
                                  └─ NotificationItem::markAsRead()
```

**Source finale** : `src/mocks/suiviData.ts::NOTIFICATIONS` (6 notifications, relatedTaskId compatibles)  
**Chargé par** : `NotificationsProvider` au démarrage via `useEffect`  
**Utilisé par** :
- `NotificationsScreen` : Liste filtrée via `useNotificationsStore()`
- `MainTabNavigator` : Badge avec compteur non lues
- `NotificationItem` : Marquer comme lue + navigation

---

### C.3. Flux de Navigation (Notification → TaskDetail)

```
NotificationItem::handleNotificationClick()  [ligne 78]
  ├─ markAsRead(notification.id)  [ligne 87]
  │   └─ notificationsStore.tsx::markAsRead()  [ligne 139]
  │       └─ setNotifications(prev => prev.map(...))  // État local mis à jour
  │
  ├─ notification.relatedTaskId  // Ex: '1', '2', '4', '7'
  │
  ├─ getTaskByIdStrict(taskId)  [ligne 103]
  │   └─ TasksContext::getTaskByIdStrict()  [ligne 122]
  │       └─ tasks.find(task => task.id === taskId)  // Recherche dans TasksContext state
  │
  ├─ Si task existe :
  │   └─ navigation.navigate('TaskDetail', { taskId })  [ligne 115]
  │       └─ TaskDetailScreen::useTaskById(taskId)
  │           └─ TasksContext::getTaskById(taskId)  [ligne 109]
  │               └─ task (affichage)
  │
  └─ Si task n'existe pas :
      └─ Alert.alert('Tâche introuvable')  [ligne 106]
```

**Validation** :
- ✅ `relatedTaskId` est vérifié avant navigation
- ✅ `getTaskByIdStrict()` vérifie l'existence de la tâche
- ✅ Alert affiché si la tâche n'existe pas
- ✅ Navigation uniquement si la tâche existe

---

## D. Analyse des Incohérences

### D.1. Incohérence 1 : Duplication de Données

**Description** : `suiviMock.ts` et `suiviData.ts` contiennent les mêmes 8 tâches avec les mêmes IDs et quickActions.

**Fichiers concernés** :
- `src/mocks/suiviMock.ts::tasks` (ligne 67)
- `src/mocks/suiviData.ts::TASKS` (ligne 88)

**Impact** : 
- Risque de divergence si une source est modifiée sans l'autre
- Confusion pour les développeurs (quelle source utiliser ?)

**Recommandation** : Unifier en utilisant uniquement `suiviData.ts`, ou faire importer `suiviMock.ts` depuis `suiviData.ts`.

---

### D.2. Incohérence 2 : Structures de Notifications Différentes

**Description** : 3 structures différentes pour les notifications :
1. `suiviData.ts` : `relatedTaskId` + `actor`
2. `suiviMock.ts` : `relatedId` + `relatedType`
3. `notificationsApi.mock.ts` : `taskId`

**Fichiers concernés** :
- `src/mocks/suiviData.ts::SuiviNotification` (ligne 49)
- `src/mocks/suiviMock.ts::Notification` (ligne 27)
- `src/api/notificationsApi.mock.ts::Notification` (ligne 11)

**Impact** :
- Migration API difficile (quelle structure utiliser ?)
- Risque d'erreur lors du remplacement par l'API réelle

**Recommandation** : Standardiser sur `relatedTaskId` (utilisé par le runtime).

---

### D.3. Incohérence 3 : TasksApi.mock.ts sans QuickAction

**Description** : `tasksApi.mock.ts` contient 10 tâches sans `quickAction`, alors que `suiviData.ts` en contient 8 avec.

**Fichiers concernés** :
- `src/api/tasksApi.mock.ts::MOCK_TASKS` (ligne 15)

**Impact** :
- Si `api/tasks.ts` est utilisé (via `USE_MOCK_API = true`), les QuickActions ne fonctionnent pas
- Potentiellement utilisé par certains hooks (via `services/api.ts`)

**Recommandation** : Vérifier si `api/tasks.ts` est réellement utilisé, sinon supprimer ou aligner sur `suiviData.ts`.

---

### D.4. Incohérence 4 : Fichiers Obsolètes Non Supprimés

**Description** : 4 fichiers obsolètes marqués mais non supprimés :
- `src/mocks/tasks/mockTasks.ts` (16 tâches, format 'task-1')
- `src/mocks/data/tasks.ts` (10 tâches, pas de quickAction)
- `src/mocks/data/notifications.ts` (5 notifications, structure ancienne)
- `src/contexts/TasksContext.tsx` (ancien contexte non monté dans App.tsx)

**Fichiers concernés** :
- `src/mocks/tasks/mockTasks.ts` (marqué obsolète ligne 4)
- `src/mocks/data/tasks.ts` (marqué obsolète ligne 4)
- `src/mocks/data/notifications.ts` (marqué obsolète ligne 4)
- `src/contexts/TasksContext.tsx` (non monté, utilise tasksApi.mock.ts directement)

**Impact** :
- Risque de réutilisation accidentelle
- Confusion lors de la maintenance (2 fichiers TasksContext.tsx)
- `contexts/TasksContext.tsx` utilise `tasksApi.mock.ts` directement (pas suiviData.ts)

**Recommandation** : 
1. Supprimer après vérification qu'ils ne sont plus référencés
2. Vérifier que `App.tsx` utilise bien `tasks/TasksContext.tsx` (confirmé ligne 28)
3. Supprimer `contexts/TasksContext.tsx` (non utilisé)

---

### D.5. Incohérence 5 : Trois Chemins d'Accès Potentiels

**Description** : Trois chemins différents pour accéder aux données :
1. `TasksContext` → `mockTaskHelpers.ts` → `suiviData.ts` ✅ **ACTIF** (utilisé par l'app)
2. `services/api.ts` → `suiviMock.ts` ⚠️ **PARALLÈLE** (utilisé par `useSuiviQuery.ts` mais non utilisé par l'app)
3. `contexts/TasksContext.tsx` → `tasksApi.mock.ts` ❌ **OBSOLÈTE** (ancien contexte non monté)

**Fichiers concernés** :
- `src/tasks/TasksContext.tsx` (ligne 22) ✅ Utilisé
- `src/services/api.ts` (ligne 55) ⚠️ Utilisé par hooks mais pas par écrans
- `src/contexts/TasksContext.tsx` (ligne 12) ❌ Non monté dans App.tsx

**Impact** :
- Risque de confusion (3 chemins possibles)
- Migration API plus complexe si plusieurs chemins actifs
- `contexts/TasksContext.tsx` obsolète mais présent dans le code

**Recommandation** : 
1. Vérifier si `useSuiviQuery.ts` est réellement utilisé (si non, supprimer `services/api.ts`)
2. Supprimer `contexts/TasksContext.tsx` (non utilisé)
3. Unifier en faisant utiliser `suiviData.ts` par tous les chemins actifs

---

## E. Recommandations Hiérarchisées

### Option 1 : Clean Minimal Mock pour Démo (RECOMMANDÉ pour MVP)

**Objectif** : Source unique et propre pour démonstration MVP.

**Actions** :
1. ✅ **Garder** : `suiviData.ts` (source unique de vérité)
2. ✅ **Garder** : `mockTaskHelpers.ts` (utilisé par TasksContext)
3. ✅ **Garder** : `notificationsStore.tsx` (utilisé par l'app)
4. ⚠️ **Nettoyer** : Supprimer `mockTasks.ts`, `data/tasks.ts`, `data/notifications.ts`
5. ⚠️ **Unifier** : Faire importer `suiviMock.ts` depuis `suiviData.ts` (réexport)
6. ⚠️ **Simplifier** : Aligner `tasksApi.mock.ts` sur `suiviData.ts` ou supprimer si non utilisé

**Avantages** :
- ✅ Structure simple et claire
- ✅ Une seule source de vérité
- ✅ Migration API directe

**Inconvénients** :
- ⚠️ Nécessite vérification que `services/api.ts` peut utiliser `suiviData.ts`

**Fichiers à modifier** :
- `src/mocks/suiviMock.ts` : Importer et réexporter depuis `suiviData.ts`
- `src/api/tasksApi.mock.ts` : Importer depuis `suiviData.ts` ou supprimer
- Supprimer : `mockTasks.ts`, `data/tasks.ts`, `data/notifications.ts`

---

### Option 2 : Unification Complète dans suiviData.ts

**Objectif** : Centraliser toutes les données dans `suiviData.ts` et supprimer toutes les autres sources.

**Actions** :
1. ✅ **Garder** : `suiviData.ts` (source unique)
2. ✅ **Modifier** : `suiviMock.ts` pour importer depuis `suiviData.ts`
3. ✅ **Modifier** : `tasksApi.mock.ts` pour importer depuis `suiviData.ts`
4. ✅ **Modifier** : `notificationsApi.mock.ts` pour importer depuis `suiviData.ts`
5. ✅ **Supprimer** : `mockTasks.ts`, `data/tasks.ts`, `data/notifications.ts`

**Avantages** :
- ✅ Source unique garantie
- ✅ Aucune duplication
- ✅ Maintenance simplifiée

**Inconvénients** :
- ⚠️ Nécessite adaptation de toutes les structures (unification des types)
- ⚠️ Risque de régression si les structures diffèrent

**Fichiers à modifier** :
- `src/mocks/suiviMock.ts` : Réexporter depuis `suiviData.ts`
- `src/api/tasksApi.mock.ts` : Utiliser `TASKS` depuis `suiviData.ts`
- `src/api/notificationsApi.mock.ts` : Utiliser `NOTIFICATIONS` depuis `suiviData.ts`
- Supprimer : `mockTasks.ts`, `data/tasks.ts`, `data/notifications.ts`

---

### Option 3 : Préparation Directe pour API Suivi

**Objectif** : Structurer les mocks pour correspondre exactement à l'API future.

**Actions** :
1. ✅ **Garder** : `suiviData.ts` comme base
2. ✅ **Créer** : `src/api/mappers.ts` pour transformer les données mock → format API
3. ✅ **Créer** : `src/api/tasks.ts` et `src/api/notifications.ts` avec switch mock/API
4. ✅ **Adapter** : Structures dans `suiviData.ts` pour correspondre aux contrats API
5. ✅ **Unifier** : Tous les contexts utilisent les clients API (pas directement suiviData.ts)

**Avantages** :
- ✅ Migration API transparente
- ✅ Tests facilités (même structure mock/API)
- ✅ Architecture scalable

**Inconvénients** :
- ⚠️ Plus de refactoring nécessaire
- ⚠️ Nécessite connaissance des contrats API Suivi

**Fichiers à créer/modifier** :
- Créer : `src/api/mappers.ts`
- Modifier : `src/api/tasks.ts` pour utiliser `suiviData.ts` via mappers
- Modifier : `src/api/notifications.ts` pour utiliser `suiviData.ts` via mappers
- Modifier : `TasksContext` et `NotificationsStore` pour utiliser les clients API

---

## F. Fichiers Concernés

### F.1. Fichiers à Garder

| Fichier | Raison | Statut |
|---------|--------|--------|
| `src/mocks/suiviData.ts` | Source unique de vérité utilisée par le runtime | ✅ **ESSENTIEL** |
| `src/mocks/tasks/mockTaskHelpers.ts` | Helper utilisé par TasksContext | ✅ **ESSENTIEL** |
| `src/features/notifications/notificationsStore.tsx` | Store React Context utilisé par l'app | ✅ **ESSENTIEL** |
| `src/tasks/TasksContext.tsx` | Context global pour les tâches (monté dans App.tsx) | ✅ **ESSENTIEL** |
| `src/api/tasks.ts` | Client API avec switch mock/réel | ✅ **GARDER** (migration API) |
| `src/api/notifications.ts` | Client API avec switch mock/réel | ✅ **GARDER** (migration API) |
| `src/services/api.ts` | Service API centralisé (utilisé par useSuiviQuery.ts) | ⚠️ **VÉRIFIER** usage réel |
| `src/hooks/useSuiviQuery.ts` | Hooks React Query (potentiellement utilisé) | ⚠️ **VÉRIFIER** usage réel |

---

### F.2. Fichiers Obsolètes à Supprimer

| Fichier | Raison | Action |
|---------|--------|--------|
| `src/mocks/tasks/mockTasks.ts` | 16 tâches avec format 'task-1', non utilisé | ❌ **SUPPRIMER** |
| `src/mocks/data/tasks.ts` | 10 tâches sans quickAction, non utilisé | ❌ **SUPPRIMER** |
| `src/mocks/data/notifications.ts` | 5 notifications, structure ancienne, non utilisé | ❌ **SUPPRIMER** |
| `src/contexts/TasksContext.tsx` | Ancien contexte non monté dans App.tsx | ❌ **SUPPRIMER** (si confirmé non utilisé) |

**Vérification préalable** :
```bash
# Vérifier que ces fichiers ne sont plus importés
grep -r "mockTasks\|data/tasks\|data/notifications\|contexts/TasksContext" src/ --exclude-dir=node_modules
```

**Confirmation** :
- `src/App.tsx` utilise `src/tasks/TasksContext.tsx` (ligne 28), pas `src/contexts/TasksContext.tsx`
- `src/contexts/TasksContext.tsx` n'est référencé nulle part

---

### F.3. Fichiers à Unifier

| Fichier | Raison | Action |
|---------|--------|--------|
| `src/mocks/suiviMock.ts` | Contient les mêmes données que suiviData.ts | ⚠️ **RÉEXPORTER depuis suiviData.ts** |
| `src/api/tasksApi.mock.ts` | 10 tâches sans quickAction, potentiellement utilisé | ⚠️ **IMPORTER depuis suiviData.ts** ou vérifier usage |
| `src/api/notificationsApi.mock.ts` | Structure différente, potentiellement utilisé | ⚠️ **ADAPTER** structure ou importer depuis suiviData.ts |

---

### F.4. Fichiers à Modifier pour Migration API

| Fichier | Modification Nécessaire |
|---------|------------------------|
| `src/mocks/suiviData.ts` | Remplacer `loadTasks()` et `loadNotifications()` par appels API |
| `src/tasks/TasksContext.tsx` | Remplacer `loadMockTasks()` par `api.getTasks(accessToken)` |
| `src/features/notifications/notificationsStore.tsx` | Remplacer `loadNotifications()` par `api.getNotifications(accessToken)` |
| `src/api/tasks.ts` | Déjà prêt avec switch `USE_MOCK_API` |
| `src/api/notifications.ts` | Déjà prêt avec switch `USE_MOCK_API` |

---

## G. Validation pour API Future

### G.1. Structure API Attendue

#### GET /api/tasks

**Réponse attendue** :
```typescript
{
  items: Task[],
  page: number,
  pageSize: number,
  total: number
}

// Où Task = {
//   id: string,              // Format backend (UUID ou numérique)
//   title: string,
//   status: TaskStatus,
//   dueDate: string,
//   projectName: string,
//   assigneeName: string,
//   updatedAt: string,
//   quickAction?: {           // ✅ Champ backend
//     actionType: string,
//     uiHint: string,
//     payload?: Record<string, any>
//   }
// }
```

**Compatibilité actuelle** :
- ✅ Structure `Task` dans `suiviData.ts` correspond
- ✅ `quickAction` présent dans toutes les tâches
- ✅ Format des IDs : strings (compatible avec UUID backend)

---

#### GET /api/notifications

**Réponse attendue** :
```typescript
Notification[]  // Array de notifications

// Où Notification = {
//   id: string,
//   type: NotificationType,
//   title: string,
//   message: string,
//   read: boolean,
//   createdAt: string,
//   relatedTaskId?: string,   // ✅ Nom de champ backend
//   projectId?: string,
//   actor?: {
//     id: string,
//     name: string,
//     avatarUrl?: string
//   }
// }
```

**Compatibilité actuelle** :
- ✅ Structure `SuiviNotification` dans `suiviData.ts` correspond
- ✅ `relatedTaskId` utilisé (nom correct)
- ✅ `actor` présent (structure correcte)

---

### G.2. Points d'Attention pour Migration

1. **IDs** :
   - ✅ Actuel : strings '1', '2', etc.
   - ⚠️ API : UUIDs ou strings numériques (à valider)
   - **Action** : Adapter le parsing si nécessaire

2. **QuickActions** :
   - ✅ Actuel : `quickAction` présent dans toutes les tâches
   - ✅ API : Champ `quickAction` attendu dans la réponse
   - **Action** : Vérifier que l'API retourne bien `quickAction` pour toutes les tâches concernées

3. **Notifications RelatedTaskId** :
   - ✅ Actuel : `relatedTaskId` format '1', '2', etc.
   - ⚠️ API : Format UUID ou numérique (à valider)
   - **Action** : Adapter le mapping si nécessaire

4. **Authentification** :
   - ⚠️ Actuel : Pas de `accessToken` dans les loaders
   - ✅ API : Nécessite `Authorization: Bearer <token>`
   - **Action** : Ajouter `accessToken` dans `loadTasks()` et `loadNotifications()`

5. **Gestion d'Erreur** :
   - ⚠️ Actuel : Gestion basique (console.error + tableau vide)
   - ✅ API : Nécessite gestion d'erreur robuste (retry, fallback, user feedback)
   - **Action** : Implémenter gestion d'erreur dans TasksContext et NotificationsStore

---

### G.3. Checklist de Migration

#### Phase 1 : Préparation

- [ ] Valider les contrats API Suivi (`GET /api/tasks`, `GET /api/notifications`)
- [ ] Vérifier le format des IDs (UUID vs numérique)
- [ ] Vérifier la structure `quickAction` dans l'API
- [ ] Vérifier la structure `actor` dans les notifications API
- [ ] Créer des mappers si nécessaire (`src/api/mappers.ts`)

#### Phase 2 : Adaptation des Loaders

- [ ] Modifier `suiviData.ts::loadTasks()` pour accepter `accessToken: string`
- [ ] Modifier `suiviData.ts::loadNotifications()` pour accepter `accessToken: string`
- [ ] Implémenter appels API réels dans ces fonctions (avec gestion d'erreur)
- [ ] Garder le fallback mock si `USE_MOCK_API = true`

#### Phase 3 : Mise à Jour des Contexts

- [ ] Modifier `TasksContext::loadTasks()` pour passer `accessToken`
- [ ] Modifier `NotificationsStore` pour passer `accessToken`
- [ ] Ajouter gestion d'erreur robuste (retry, fallback)
- [ ] Tester les états loading/error/success

#### Phase 4 : Tests et Validation

- [ ] Tester navigation Notification → TaskDetail avec données API réelles
- [ ] Vérifier que les QuickActions fonctionnent avec données API
- [ ] Vérifier que les badges de notifications se mettent à jour
- [ ] Valider la gestion d'erreur (réseau, authentification, etc.)

#### Phase 5 : Nettoyage

- [ ] Supprimer les fichiers obsolètes (`mockTasks.ts`, `data/tasks.ts`, `data/notifications.ts`)
- [ ] Supprimer ou adapter `suiviMock.ts` (selon Option choisie)
- [ ] Nettoyer les imports inutilisés
- [ ] Mettre à jour la documentation

---

## H. Fichiers Analysés

### Sources Mock Tâches

- ✅ `src/mocks/suiviData.ts` (368 lignes) - ACTIVE
- ✅ `src/mocks/suiviMock.ts` (401 lignes) - PARALLÈLE
- ✅ `src/api/tasksApi.mock.ts` (240 lignes) - PARALLÈLE
- ✅ `src/mocks/tasks/mockTasks.ts` (261 lignes) - OBSOLÈTE
- ✅ `src/mocks/data/tasks.ts` (187 lignes) - OBSOLÈTE

### Sources Mock Notifications

- ✅ `src/mocks/suiviData.ts::NOTIFICATIONS` (6 notifications) - ACTIVE
- ✅ `src/features/notifications/notificationsStore.tsx` (198 lignes) - ACTIVE
- ✅ `src/mocks/suiviMock.ts::MOCK_NOTIFICATIONS` (5 notifications) - PARALLÈLE
- ✅ `src/api/notificationsApi.mock.ts` (109 lignes) - PARALLÈLE
- ✅ `src/mocks/data/notifications.ts` (96 lignes) - OBSOLÈTE

### Contexts et Providers

- ✅ `src/tasks/TasksContext.tsx` (218 lignes)
- ✅ `src/mocks/tasks/mockTaskHelpers.ts` (86 lignes)
- ✅ `src/features/notifications/notificationsStore.tsx` (198 lignes)

### Écrans et Composants

- ✅ `src/screens/MyTasksScreen.tsx` (185 lignes)
- ✅ `src/screens/TaskDetailScreen.tsx` (574 lignes)
- ✅ `src/screens/NotificationsScreen.tsx` (207 lignes)
- ✅ `src/components/ui/NotificationItem.tsx` (419 lignes)
- ✅ `src/navigation/MainTabNavigator.tsx` (170 lignes)

### API Clients

- ✅ `src/api/tasks.ts` (190 lignes)
- ✅ `src/api/notifications.ts` (70 lignes)
- ✅ `src/services/api.ts` (234 lignes)

---

## I. Conclusion

### État Actuel

**✅ Points Positifs** :
- `suiviData.ts` est la source unique de vérité utilisée par le runtime
- IDs cohérents partout (format '1', '2', etc.)
- Navigation Notification → TaskDetail fonctionnelle
- QuickActions présentes sur toutes les tâches
- Structure compatible avec l'API future

**⚠️ Points d'Attention** :
- Duplication entre `suiviData.ts` et `suiviMock.ts`
- 3 fichiers obsolètes non supprimés
- `tasksApi.mock.ts` sans quickAction (potentiellement utilisé)
- Structures de notifications différentes selon la source

### Recommandation Principale

**Option 1 (Clean Minimal Mock)** : Supprimer les fichiers obsolètes et unifier `suiviMock.ts` et `tasksApi.mock.ts` vers `suiviData.ts`. Cette option minimise le refactoring tout en garantissant une source unique.

### Prochaines Étapes

1. Vérifier que `services/api.ts` peut utiliser `suiviData.ts` directement
2. Supprimer les fichiers obsolètes après vérification
3. Unifier `suiviMock.ts` vers `suiviData.ts`
4. Préparer la migration API en adaptant les loaders pour accepter `accessToken`

---

**Rapport généré automatiquement - Audit complet terminé**  
**Dernière mise à jour** : 2024-11-16

