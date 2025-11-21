# Audit Suivi Mobile – Données Tâches & Écrans

**Date de l'audit** : 2024-11-17  
**Auditeur** : Cursor Agent  
**Portée** : Audit complet du fonctionnement des tâches et de leurs données dans l'application mobile Suivi

---

## 1. Fichiers de mocks

### 1.1 Fichiers principaux identifiés

#### 📄 `src/mocks/tasks/mockTasks.ts`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/mocks/tasks/mockTasks.ts`
- **Rôle** : Contient la liste complète des tâches mockées (`MOCK_TASKS`)
- **Contenu résumé** : 
  - 16 tâches mockées avec statuts variés (todo, in_progress, blocked, done)
  - Dates cohérentes (certaines dues today, passées, futures)
  - Projets variés (Mobile App, Design System, Backend API)
  - Utilise le type `Task` depuis `../../tasks/tasks.types`
- **Structure exportée** : `export const MOCK_TASKS: Task[]`

#### 📄 `src/mocks/tasks/mockTaskHelpers.ts`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/mocks/tasks/mockTaskHelpers.ts`
- **Rôle** : Fonctions utilitaires pour manipuler les tâches mock
- **Contenu résumé** :
  - `loadMockTasks()` : Charge toutes les tâches (simule délai réseau 300ms)
  - `loadMockTaskById(id)` : Charge une tâche par ID (simule délai 200ms)
  - `updateMockTask(id, updates)` : Met à jour une tâche (simule délai 200ms)
  - `updateMockTaskStatus(id, status)` : Met à jour uniquement le statut
- **Structure exportée** : Fonctions asynchrones retournant `Promise<Task[] | Task>`

#### 📄 `src/api/tasksApi.mock.ts`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/api/tasksApi.mock.ts`
- **Rôle** : API mockée pour les tâches (simulation d'appels HTTP)
- **Contenu résumé** :
  - Tableau interne `MOCK_TASKS` (10 tâches avec structure simplifiée)
  - `getMyTasks(filter)` : Récupère les tâches avec filtre ('all', 'active', 'completed')
  - `getTaskById(id)` : Récupère une tâche par ID
  - `updateTaskStatus(id, status)` : Met à jour le statut
  - `getMyPriorities()`, `getDueSoon()`, `getRecentlyUpdated()`, `getLate()` : Helpers de filtrage
  - `quickCapture(text)` : Crée une tâche rapide minimaliste
- **Structure exportée** : Fonctions asynchrones avec délais simulés

#### 📄 `src/mocks/data/tasks.ts`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/mocks/data/tasks.ts`
- **Rôle** : Autre fichier de mocks pour les tâches (structure alternative)
- **Contenu résumé** :
  - Tableau interne `MOCK_TASKS` (10 tâches)
  - `getTasks(params)` : Récupère les tâches avec pagination et filtres
  - `getTaskById(taskId)` : Récupère une tâche par ID
  - `updateTaskStatus(taskId, newStatus)` : Met à jour le statut
  - Helpers similaires aux autres fichiers
- **Structure exportée** : Fonctions avec pagination et filtrage

#### 📄 `src/mocks/suiviMock.ts`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/mocks/suiviMock.ts`
- **Rôle** : Module centralisé de mocks (incluant tâches)
- **Contenu résumé** :
  - `MOCK_TASKS` : 8 tâches avec structure complète
  - `getTasks(params)` : Avec pagination et filtres
  - `getTaskById(taskId)`, `getProjects()`, `getNotifications()`, `getUser()`, `getQuickStats()`
- **Structure exportée** : Objet `mock` avec toutes les fonctions exportées

### 1.2 Doublons et redondances détectés

⚠️ **PROBLÈME IDENTIFIÉ** : Plusieurs fichiers de mocks avec des structures légèrement différentes :
- `src/mocks/tasks/mockTasks.ts` (16 tâches, type `Task` depuis `tasks.types.ts`)
- `src/api/tasksApi.mock.ts` (10 tâches, type `Task` depuis `api/tasks.ts`)
- `src/mocks/data/tasks.ts` (10 tâches, type `Task` depuis `api/tasks.ts`)
- `src/mocks/suiviMock.ts` (8 tâches, type `Task` depuis `api/tasks.ts`)

**Recommandation** : Unifier sur un seul fichier de mocks une fois l'audit terminé.

---

## 2. Structure des tâches

### 2.1 Interface Task principale (`src/tasks/tasks.types.ts`)

```typescript
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;  // Format ISO 8601: YYYY-MM-DD
  projectId?: string;
  projectName?: string;
  workspaceName?: string;
  boardName?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  createdAt: string;  // Format ISO 8601
  updatedAt: string;  // Format ISO 8601
}
```

**Type de statut** :
```typescript
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
```

**Type de filtre** :
```typescript
export type TaskFilter = 'all' | 'active' | 'completed';
```

### 2.2 Interface Task alternative (`src/api/tasks.ts`)

```typescript
export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: string | null;
  projectName?: string | null;
  assigneeName?: string | null;
  updatedAt?: string;
  description?: string | null;
  workspaceName?: string | null;
  boardName?: string | null;
};
```

⚠️ **INCOHÉRENCE DÉTECTÉE** : Deux définitions de `Task` légèrement différentes :
- `tasks.types.ts` : Plus complète (projectId, createdAt, assigneeInitials)
- `api/tasks.ts` : Plus simple, certains champs optionnels avec `| null`

### 2.3 Champs proches de "actions", "eventType", "status history"

❌ **Champs absents dans Task** :
- Aucun champ `actions` ou `quickActions`
- Aucun champ `eventType`
- Aucun champ `statusHistory` ou historique de statuts
- Aucun champ `activityLogs` ou logs d'activité

✅ **Champs présents pouvant être utilisés** :
- `status` : Statut actuel (peut servir de base pour l'historique)
- `updatedAt` : Date de dernière mise à jour (indique quand le statut a changé)
- `createdAt` : Date de création (premier événement d'historique potentiel)

**Conclusion** : La structure actuelle de `Task` ne contient **pas** de système d'historique intégré. L'historique est géré séparément via le système d'activité (`SuiviActivityEvent`).

---

## 3. Page "Mes tâches"

### 3.1 Écran principal

#### 📱 `src/screens/MyTasksScreen.tsx`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/screens/MyTasksScreen.tsx`
- **Rôle** : Écran principal affichant la liste des tâches filtrées
- **Composants utilisés** :
  - `Screen` : Conteneur de base
  - `AppHeader` : En-tête avec bouton retour
  - `TasksFilterControl` : Contrôle de filtre (All / Active / Completed)
  - `TaskItem` : Composant de carte pour chaque tâche
  - `AiBriefingButton` : Bouton AI Daily Briefing (TODO)
  - `SuiviText` : Typographie Suivi
- **Hooks utilisés** :
  - `useTasks(filter)` : Récupère les tâches filtrées depuis `TasksContext`
  - `useTranslation()` : i18n
  - `useNavigation()`, `useRoute()` : Navigation
- **Flux de données** :
  1. Charge les tâches via `useTasks(filter)` depuis `TasksContext`
  2. Affiche une `FlatList` avec `TaskItem` pour chaque tâche
  3. Filtrage client-side selon `filter` ('all', 'active', 'completed')
  4. Refresh via `onRefresh` appelle `refresh()` du hook
  5. Navigation vers `TaskDetail` au clic sur une carte

### 3.2 Composant de carte de tâche

#### 🎴 `src/components/ui/TaskItem.tsx`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/components/ui/TaskItem.tsx`
- **Rôle** : Affiche une carte de tâche dans la liste
- **Props** :
  ```typescript
  interface TaskItemProps {
    task: Task;  // Task depuis api/tasks
    onPress?: () => void;
    style?: ViewStyle;
  }
  ```
- **Affichage** :
  - Ligne supérieure : Breadcrumb (hardcodé "WORKSPACE > BOARD") + Badge de statut coloré
  - Titre : `task.title` en `SuiviText variant="h2"`
  - Date d'échéance : Icône calendrier + `task.dueDate` formaté
- **Logique** :
  - Couleur du statut via `getStatusColor(status)` : todo (primary), in_progress (maize), blocked (error), done (success)
  - Formatage du statut avec i18n via `formatStatus(status, t)`
  - Formatage de la date simple (YYYY-MM-DD)

### 3.3 Composant de filtre

#### 🎛️ `src/components/ui/TasksFilterControl.tsx`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/components/ui/TasksFilterControl.tsx`
- **Rôle** : Contrôle de filtre pour les tâches (segmented control)
- **Props** :
  ```typescript
  interface TasksFilterControlProps {
    value: string;  // 'all' | 'active' | 'completed'
    onChange: (newValue: string) => void;
  }
  ```
- **Options** : 3 options via `SegmentedControl` (All / Active / Completed) avec i18n

### 3.4 Logique de filtrage

Le filtrage est effectué dans **deux endroits** :

1. **`src/tasks/TasksContext.tsx`** (via `getTasksByStatus`) :
   ```typescript
   getTasksByStatus(status: TaskStatus | 'all' | 'active' | 'completed'): Task[]
   ```
   - `'all'` : Toutes les tâches
   - `'active'` : Toutes sauf `'done'` (todo, in_progress, blocked)
   - `'completed'` : Uniquement `'done'`
   - Statut spécifique : Filtre par statut exact

2. **`src/features/tasks/taskFilters.ts`** (helpers partagés) :
   - `isTaskActive(task)` : Vérifie si une tâche est active
   - `isTaskCompleted(task)` : Vérifie si une tâche est complétée
   - `isDueToday(task)` : Vérifie si une tâche est due aujourd'hui
   - `filterTasks(tasks, filter)` : Filtre une liste selon le filtre

⚠️ **REDONDANCE** : Logique de filtrage dupliquée entre `TasksContext` et `taskFilters.ts`

---

## 4. Page "Tâche détails"

### 4.1 Écran de détail

#### 📱 `src/screens/TaskDetailScreen.tsx`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/screens/TaskDetailScreen.tsx`
- **Rôle** : Affiche les détails complets d'une tâche
- **Sections principales** :
  1. **Status Selector** : Carte avec sélecteur de statut (`SuiviStatusPicker`)
  2. **Task Details Card** : Description, projet, date d'échéance, assigné, date de mise à jour
  3. **Activity Timeline Section** : Historique d'activité de la tâche
- **Hooks utilisés** :
  - `useTaskById(taskId)` : Récupère la tâche par ID depuis `TasksContext`
  - `useUpdateTaskStatus()` : Met à jour le statut
  - `useTaskActivity(taskId)` : Récupère l'historique d'activité (via `useActivity`)
  - `useUser()` : Récupère les infos utilisateur (pour assigné)
- **Flux de données** :
  1. Charge la tâche via `useTaskById(taskId)`
  2. Charge l'historique via `useTaskActivity(taskId)` → `activityAPI.getTaskActivity(taskId)`
  3. Affichage des détails dans une `SuiviCard`
  4. Section "Activity Timeline" affiche les activités filtrées par `taskId`
  5. Modification du statut via `SuiviStatusPicker` → `handleChangeStatus` → `updateStatus(taskId, newStatus)`

### 4.2 Sous-composants

#### 🎨 `src/components/ui/SuiviStatusPicker.tsx`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/components/ui/SuiviStatusPicker.tsx`
- **Rôle** : Modal bottom sheet pour sélectionner un statut
- **Props** :
  ```typescript
  interface SuiviStatusPickerProps {
    visible: boolean;
    onClose: () => void;
    currentStatus: TaskStatus;
    onSelectStatus: (status: TaskStatus) => void;
  }
  ```
- **Affichage** : Liste des 4 statuts (todo, in_progress, blocked, done) avec couleurs et icônes

### 4.3 Zone "Historique d'activité"

**Emplacement** : Lignes 228-260 de `TaskDetailScreen.tsx`

**Structure** :
- Titre de section : "Activity Timeline" (i18n)
- Affichage conditionnel :
  - Si `taskActivities.length > 0` : Timeline avec points et lignes
  - Sinon : Carte vide avec message "No activity"

**Format d'affichage** :
```typescript
taskActivities.map((activity) => (
  <View key={activity.id}>
    <View style={styles.timelineDot} />
    <SuiviCard>
      <SuiviText>
        {activity.actor.name} {activity.message} "{activity.target.name}"
      </SuiviText>
      <SuiviText>{formatActivityDate(activity.createdAt)}</SuiviText>
    </SuiviCard>
  </View>
))
```

⚠️ **PROBLÈME IDENTIFIÉ** : Le format d'affichage ne correspond pas à la structure réelle de `SuiviActivityEvent` :
- Code affiche : `activity.message` et `activity.target.name`
- Structure réelle : `activity.title`, `activity.eventType`, `activity.taskInfo.taskTitle`, etc.

**Conclusion** : Il y a une **incompatibilité** entre le format attendu dans `TaskDetailScreen` et la structure réelle des activités.

---

## 5. Historique d'activité

### 5.1 Structure des activités

#### 📋 `src/types/activity.ts`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/types/activity.ts`
- **Rôle** : Définit les types pour les activités Suivi
- **Types principaux** :

```typescript
// Type d'événement
export type SuiviActivityEventType =
  | 'TASK_CREATED'
  | 'TASK_COMPLETED'
  | 'TASK_REPLANNED'
  | 'OBJECTIVE_STATUS_CHANGED'
  | 'BOARD_CREATED'
  | 'BOARD_UPDATED'
  | 'BOARD_ARCHIVED'
  | 'PORTAL_CREATED'
  | 'PORTAL_UPDATED'
  | 'PORTAL_SHARED';

// Événement d'activité
export interface SuiviActivityEvent {
  id: string;
  source: 'BOARD' | 'PORTAL';
  eventType: SuiviActivityEventType;
  title: string;
  workspaceName: string;
  boardName?: string;
  portalName?: string;
  actor: SuiviActivityActor;  // { name, avatarUrl?, userId? }
  createdAt: string;
  severity: 'INFO' | 'IMPORTANT' | 'CRITICAL';
  taskInfo?: SuiviActivityTaskInfo;  // { taskId, taskTitle, taskStatus?, previousDueDate?, newDueDate? }
  objectiveInfo?: SuiviActivityObjectiveInfo;
  boardInfo?: SuiviActivityBoardInfo;
  portalInfo?: SuiviActivityPortalInfo;
}
```

### 5.2 Mocks d'activité

#### 📄 `src/mocks/data/activity.ts`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/mocks/data/activity.ts`
- **Rôle** : Données mockées pour les activités récentes
- **Contenu** : 20 événements d'activité mockés couvrant tous les types d'événements
- **Fonctions exportées** :
  - `getMockRecentActivity()` : Retourne tous les événements
  - `getMockRecentActivityLimited(limit)` : Retourne les N plus récents
  - `getMockActivityByWorkspace(workspaceName)` : Filtre par workspace
  - `getMockActivityBySeverity(severity)` : Filtre par sévérité

### 5.3 API d'activité

#### 📡 `src/api/activity.ts`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/api/activity.ts`
- **Rôle** : Adaptateur API pour les activités
- **Fonctions exportées** :
  - `getRecentActivity(accessToken, options)` : Récupère les activités récentes
  - ❌ **`getTaskActivity(taskId, accessToken)` : FONCTION MANQUANTE** (utilisée dans `useActivity.ts` mais non implémentée)

### 5.4 Hooks d'activité

#### 🔗 `src/hooks/useActivity.ts`
- **Chemin** : `/Users/julien/Desktop/Suivi-mobile-app/src/hooks/useActivity.ts`
- **Rôle** : Hooks React Query pour récupérer les activités
- **Hooks** :
  - `useActivityFeed(limit, options)` : Récupère le fil d'activité récent
  - `useTaskActivity(taskId, options)` : Récupère l'activité d'une tâche spécifique
    - ⚠️ **PROBLÈME** : Appelle `activityAPI.getTaskActivity(taskId, accessToken)` qui **n'existe pas**

### 5.5 Fonctionnement actuel

**Flux pour récupérer l'historique d'une tâche** :
1. `TaskDetailScreen` appelle `useTaskActivity(taskId)`
2. `useTaskActivity` appelle `activityAPI.getTaskActivity(taskId, accessToken)`
3. ❌ **ERREUR** : `getTaskActivity` n'est pas implémentée dans `activity.ts`
4. Les mocks retournent tous les événements, pas filtrés par `taskId`

**Conclusion** : La fonction `getTaskActivity` est **manquante** et doit être implémentée pour filtrer les activités par `taskId` via `taskInfo.taskId`.

---

## 6. Points d'attention

### 6.1 Points faciles à implémenter

✅ **Structure de base solide** :
- Types bien définis (`Task`, `TaskStatus`, `SuiviActivityEvent`)
- Hooks réutilisables (`useTasks`, `useTaskById`, `useUpdateTaskStatus`)
- Composants UI cohérents (`TaskItem`, `SuiviStatusPicker`, `TasksFilterControl`)

✅ **Système d'activité existant** :
- Types `SuiviActivityEvent` avec `eventType` déjà en place
- Mocks d'activité disponibles
- Infrastructure React Query prête

✅ **Points d'intégration clairs** :
- `TaskDetailScreen` a déjà une section "Activity Timeline"
- `useTaskActivity` est déjà utilisé (mais non fonctionnel)

### 6.2 Points risqués / Problématiques

❌ **Incohérences de structure** :
- Deux définitions de `Task` différentes (`tasks.types.ts` vs `api/tasks.ts`)
- Plusieurs fichiers de mocks avec structures légèrement différentes
- Logique de filtrage dupliquée

❌ **Fonctions manquantes** :
- `getTaskActivity(taskId)` : Non implémentée dans `activity.ts`
- Format d'affichage dans `TaskDetailScreen` ne correspond pas à `SuiviActivityEvent`

❌ **Historique de statut** :
- Aucun historique de changement de statut dans `Task`
- Pas de `statusHistory` ou historique intégré
- Seuls `createdAt` et `updatedAt` indiquent les dates de changement

❌ **Actions / Quick Actions** :
- Aucun système d'actions dans `Task`
- Pas de champ `quickActions` ou `availableActions`
- Les "quick actions" mentionnés dans d'autres écrans (notifications) ne sont pas liés aux tâches

### 6.3 Ce qui sera facile / risqué pour la suite

#### ✅ **Facile** :

1. **Ajouter des champs à `Task`** :
   - La structure est extensible
   - Les composants utilisent déjà des champs optionnels
   - Pas de breaking change si les nouveaux champs sont optionnels

2. **Implémenter `getTaskActivity`** :
   - Infrastructure déjà en place
   - Mocks disponibles pour tester
   - Filtrage simple par `taskInfo.taskId`

3. **Ajouter un champ `quickActions`** :
   - Structure flexible
   - Peut être calculé dynamiquement selon `status`
   - Pas de migration de données nécessaire (mock)

#### ⚠️ **Risqué** :

1. **Unifier les définitions de `Task`** :
   - Impact sur tous les composants utilisant `api/tasks.ts`
   - Risque de breaking changes
   - Nécessite un audit complet des imports

2. **Corriger l'affichage de l'historique** :
   - `TaskDetailScreen` utilise un format incorrect
   - Nécessite de réécrire la section "Activity Timeline"
   - Tests visuels à revérifier

3. **Ajouter un historique de statut intégré** :
   - Nouvelle structure de données
   - Migration potentielle des mocks
   - Calcul de l'historique depuis les activités ou nouveau champ

4. **Intégrer "quick actions" dans les tâches** :
   - Pas de structure existante
   - Définition des actions possibles par statut
   - UI à créer (boutons, modals, etc.)

### 6.4 Recommandations

1. **À court terme** :
   - Implémenter `getTaskActivity(taskId)` dans `activity.ts`
   - Corriger l'affichage de l'historique dans `TaskDetailScreen` pour utiliser `SuiviActivityEvent`
   - Unifier les fichiers de mocks (garder un seul fichier principal)

2. **À moyen terme** :
   - Unifier les définitions de `Task` (choisir une seule source de vérité)
   - Nettoyer les redondances de logique de filtrage
   - Ajouter des tests pour vérifier la cohérence des structures

3. **À long terme** :
   - Implémenter un système d'historique de statut intégré (optionnel)
   - Ajouter le support des "quick actions" dans les tâches
   - Migrer vers l'API Suivi réelle (actuellement tous les appels sont mockés)

---

## 7. Résumé exécutif

### ✅ Points forts
- Architecture claire avec séparation des responsabilités
- Types TypeScript bien définis
- Composants UI réutilisables et cohérents
- Système d'activité avec infrastructure React Query

### ⚠️ Points faibles
- Redondances dans les mocks (4 fichiers différents)
- Incohérences de types (`Task` défini 2 fois)
- Fonction manquante (`getTaskActivity`)
- Affichage de l'historique incompatible avec la structure réelle

### 🎯 Actions prioritaires
1. **Critique** : Implémenter `getTaskActivity(taskId)` pour que l'historique fonctionne
2. **Important** : Corriger l'affichage de l'historique dans `TaskDetailScreen`
3. **Moyen** : Unifier les fichiers de mocks
4. **Long terme** : Ajouter support des "quick actions" et historique de statut

---

**FIN DE L'AUDIT**

