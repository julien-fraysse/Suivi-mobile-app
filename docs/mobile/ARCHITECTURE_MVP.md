# Architecture MVP - Suivi Mobile App

Ce document décrit la structure de l'application mobile Suivi MVP et comment remplacer les mocks par les vraies API Suivi.

## Vue d'ensemble

L'application utilise des **stores simples basés sur React hooks** (`useState`, `useMemo`, `useCallback`) pour gérer l'état des données en mémoire. Ces stores sont conçus pour être facilement remplacés par des appels API réels sans modifier les composants UI.

**Pas de librairies externes** : Aucune dépendance à React Query, Redux, Zustand, etc. Uniquement React standard.

---

## Stores Mock

### 1. Tasks Store

**Fichier** : `src/features/tasks/taskStore.ts`

**Hook** : `useTasksStore()`

**Interface** :
```typescript
{
  tasks: Task[];                    // Toutes les tâches
  updateTaskStatus(id, status);     // Mettre à jour le statut d'une tâche
  getTaskById(id);                  // Récupérer une tâche par ID
  stats: {                          // Statistiques calculées
    total: number;
    activeCount: number;
    dueTodayCount: number;
  };
}
```

**Utilisation** :
- `HomeScreen` : Affiche les stats (activeCount, dueTodayCount)
- `MyTasksScreen` : Liste et filtre les tâches
- `TaskDetailScreen` : Affiche et met à jour le statut d'une tâche

**TODO pour API Suivi** :
1. Remplacer `useState(INITIAL_TASKS)` par un appel API `GET /api/tasks` au montage
2. Dans `updateTaskStatus`, ajouter un appel `PATCH /api/tasks/:id/status` avant la mise à jour locale
3. Garder la même interface du hook pour que les composants n'aient pas besoin de changer

---

### 2. Notifications Store

**Fichier** : `src/features/notifications/notificationsStore.ts`

**Hook** : `useNotificationsStore()`

**Interface** :
```typescript
{
  notifications: Notification[];     // Toutes les notifications
  markAsRead(id);                   // Marquer une notification comme lue
  markAllAsRead();                  // Marquer toutes les notifications comme lues
}
```

**Utilisation** :
- `NotificationsScreen` : Liste les notifications et gère le marquage comme lu

**TODO pour API Suivi** :
1. Remplacer `useState(INITIAL_NOTIFICATIONS)` par un appel API `GET /api/notifications` au montage
2. Dans `markAsRead`, ajouter un appel `PATCH /api/notifications/:id/read`
3. Dans `markAllAsRead`, ajouter un appel `PATCH /api/notifications/read-all`

---

## Structure des fichiers

```
src/
├── features/
│   ├── tasks/
│   │   ├── taskStore.ts          # Store centralisé pour les tâches
│   │   └── taskFilters.ts        # Helpers de filtrage (déjà existant)
│   └── notifications/
│       └── notificationsStore.ts # Store centralisé pour les notifications
├── screens/
│   ├── HomeScreen.tsx            # Utilise useTasksStore().stats
│   ├── MyTasksScreen.tsx         # Utilise useTasksStore().tasks
│   ├── TaskDetailScreen.tsx      # Utilise useTasksStore().getTaskById + updateTaskStatus
│   └── NotificationsScreen.tsx   # Utilise useNotificationsStore()
└── api/
    ├── tasksApi.mock.ts          # Ancien fichier mock (peut être supprimé après migration)
    └── notificationsApi.mock.ts  # Ancien fichier mock (peut être supprimé après migration)
```

---

## Comment remplacer les mocks par l'API Suivi

### Étape 1 : Créer le client API

Créer `src/api/client.ts` (si ce n'est pas déjà fait) qui encapsule les appels HTTP vers l'API Suivi.

Exemple :
```typescript
// src/api/client.ts
const API_BASE_URL = 'https://api.suivi.app';

export async function apiGet(endpoint: string, token: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function apiPatch(endpoint: string, data: any, token: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

### Étape 2 : Modifier `taskStore.ts`

```typescript
// AVANT (mock)
const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

// APRÈS (API)
const [tasks, setTasks] = useState<Task[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadTasks = async () => {
    try {
      const token = getAccessToken(); // Récupérer depuis AuthContext
      const data = await apiGet('/api/tasks', token);
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };
  loadTasks();
}, []);

const updateTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
  try {
    const token = getAccessToken();
    await apiPatch(`/api/tasks/${taskId}/status`, { status }, token);
    // Mettre à jour l'état local après succès API
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date().toISOString() }
          : task
      )
    );
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error; // Les composants peuvent gérer l'erreur si nécessaire
  }
}, []);
```

**Important** : Garder la même interface du hook (`useTasksStore()`) pour que les composants UI n'aient pas besoin de changer.

### Étape 3 : Appliquer la même logique pour `notificationsStore.ts`

Même principe : remplacer `useState(INITIAL_NOTIFICATIONS)` par des appels API dans `useEffect`, et ajouter les appels API dans `markAsRead` et `markAllAsRead`.

---

## Garanties de synchronisation

Actuellement, la synchronisation est garantie par le fait que :
- Tous les écrans (Home, MyTasks, TaskDetail) utilisent le même store (`useTasksStore()`)
- Quand `updateTaskStatus` est appelé dans `TaskDetailScreen`, il met à jour l'état partagé
- `HomeScreen` et `MyTasksScreen` se mettent à jour automatiquement car ils lisent depuis le même état

**Avec l'API Suivi** :
- Après un appel API réussi, mettre à jour l'état local avec `setTasks`
- Si plusieurs écrans sont ouverts en même temps, ils resteront synchronisés car ils partagent le même état React
- Pour une synchronisation en temps réel, on pourra ajouter plus tard WebSockets ou polling

---

## Points d'attention

1. **Gestion des erreurs** : Actuellement, les stores ne gèrent pas les erreurs. Quand on branchera l'API, ajouter `try/catch` et exposer `error` dans le retour du hook si nécessaire.

2. **Loading states** : Actuellement, pas de loading states dans les stores. Pour l'API, ajouter `isLoading` dans le retour du hook et l'utiliser dans les composants.

3. **Authentification** : Les appels API nécessiteront un token d'authentification. Utiliser `useAuth()` pour récupérer le token.

4. **Cache / Refresh** : Pour l'instant, les données sont chargées une seule fois. Avec l'API, on pourra ajouter une fonction `refresh()` pour recharger les données depuis le serveur.

---

## Quick Capture

Le Quick Capture utilise actuellement `quickCapture()` dans `tasksApi.mock.ts`. 

**TODO** : Quand l'API Suivi sera prête, remplacer par :
- `POST /api/tasks/quick-capture` avec `{ text: string }`
- Après succès, ajouter la nouvelle tâche au store avec `setTasks(prev => [...prev, newTask])`

---

## Documentation complémentaire

- `docs/mobile/mock-data.md` : Détails sur l'architecture actuelle des mocks
- `docs/mobile/screens-overview.md` : Vue d'ensemble des écrans
- `docs/mobile/api-contract.md` : Contrat d'API attendu (si documenté)


