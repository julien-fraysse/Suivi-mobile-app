# Task Filters - Helpers Partagés

## Vue d'ensemble

Le module `src/features/tasks/taskFilters.ts` contient des helpers partagés pour filtrer et compter les tâches de manière **cohérente** entre HomeScreen (Quick Actions) et MyTasksScreen.

Ces fonctions garantissent que :
- Les chiffres affichés dans Quick Actions correspondent exactement aux listes filtrées dans MyTasksScreen
- La même logique de filtrage est utilisée partout dans l'app

## Fonctions Principales

### `isTaskActive(task: Task): boolean`

Vérifie si une tâche est "active" (todo, in_progress, ou blocked).

**Utilisé par** : `getActiveTasksCount()`, `filterTasks()` avec filtre `'active'`

---

### `isTaskCompleted(task: Task): boolean`

Vérifie si une tâche est complétée (done).

**Utilisé par** : `filterTasks()` avec filtre `'completed'`

---

### `isDueToday(task: Task, today: Date = new Date()): boolean`

Vérifie si une tâche est due aujourd'hui.

**Logique** :
- Compare uniquement l'année / mois / jour (ignore l'heure)
- Utilise la date locale du device
- Retourne `false` si la tâche n'a pas de `dueDate`

**TODO** : À terme, ce calcul pourra être branché à :
- Des données Suivi réelles avec timezone correcte
- Une éventuelle intégration calendrier iOS/Android

**Utilisé par** : `getDueTodayTasksCount()`, `filterTasks()` avec filtre `'dueToday'`

---

### `filterTasks(tasks: Task[], filter: TaskFilter, today?: Date): Task[]`

Filtre une liste de tâches selon le filtre spécifié.

**Filtres supportés** :
- `'all'` : Toutes les tâches
- `'active'` : Tâches actives (todo, in_progress, blocked)
- `'completed'` : Tâches complétées (done)
- `'dueToday'` : Tâches dues aujourd'hui

**Utilisé par** : MyTasksScreen pour filtrer la liste des tâches

---

### `getActiveTasksCount(tasks: Task[]): number`

Compte les tâches actives (todo, in_progress, blocked).

**Utilisé par** : HomeScreen pour afficher le nombre "Active Tasks" dans Quick Actions

---

### `getDueTodayTasksCount(tasks: Task[], today?: Date): number`

Compte les tâches dues aujourd'hui.

**Utilisé par** : HomeScreen pour afficher le nombre "Due Today" dans Quick Actions

## Utilisation

### HomeScreen

```typescript
import { useTasks } from '../hooks/useTasks';
import { getActiveTasksCount, getDueTodayTasksCount } from '../features/tasks/taskFilters';

const { data: tasksData } = useTasks({ filters: { status: 'all' }, pageSize: 1000 });
const allTasks = tasksData?.pages.flatMap((page) => page.items) ?? [];

const activeTasksCount = getActiveTasksCount(allTasks);
const dueTodayCount = getDueTodayTasksCount(allTasks);
```

### MyTasksScreen

```typescript
import { filterTasks } from '../features/tasks/taskFilters';

const filteredTasks = filterTasks(allTasks, filter);
```

## Garanties

1. **Cohérence** : Les chiffres Quick Actions correspondent exactement aux listes filtrées
2. **Source unique** : HomeScreen et MyTasksScreen utilisent la même source de vérité (`useTasks()`)
3. **Calcul correct** : `isDueToday()` compare correctement les dates (année/mois/jour uniquement)


