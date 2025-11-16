# Architecture des Mock Data

## Vue d'ensemble

L'application mobile Suivi utilise actuellement des **mocks** pour simuler les appels API. Cette architecture est conçue pour être facilement remplacée par une vraie API Suivi sans modifier les écrans ni les hooks React Query.

## Structure actuelle

### Fichiers API Mock

Tous les mocks sont centralisés dans `/src/api/*.mock.ts` :

- **`tasksApi.mock.ts`** : Mocks pour les tâches
  - `getMyTasks(filter)` : Récupère les tâches filtrées
  - `getTaskById(id)` : Récupère une tâche par ID
  - `updateTaskStatus(id, status)` : Met à jour le statut d'une tâche
  - `quickCapture(text)` : Capture rapide d'une tâche minimaliste
  - `getMyPriorities()` : Tâches prioritaires
  - `getDueSoon()` : Tâches dues bientôt
  - `getRecentlyUpdated()` : Tâches récemment mises à jour
  - `getLate()` : Tâches en retard

- **`notificationsApi.mock.ts`** : Mocks pour les notifications
  - `getNotifications()` : Récupère toutes les notifications
  - `markNotificationRead(id)` : Marque une notification comme lue
  - `markAllNotificationsRead()` : Marque toutes les notifications comme lues

- **`authApi.mock.ts`** : Mocks pour l'authentification
  - `signIn(email, password)` : Connecte un utilisateur (retourne un token mock)

### Fichiers API Switchable

Les fichiers `/src/api/*.ts` utilisent le flag `USE_MOCK_API` pour basculer entre mocks et vraies API :

- **`tasks.ts`** : Utilise `tasksApi.mock.ts` si `USE_MOCK_API = true`
- **`notifications.ts`** : Utilise `notificationsApi.mock.ts` si `USE_MOCK_API = true`
- **`users.ts`** : Utilise `usersApi.mock.ts` si `USE_MOCK_API = true`

**Flag de configuration** : `/src/config/environment.ts`
```typescript
export const USE_MOCK_API = true; // true = mocks, false = real API
```

### Hooks React Query

Les hooks dans `/src/hooks/*.ts` appellent les fonctions API et gèrent le cache :

- `useTasks()` : Hook pour récupérer les tâches avec pagination
- `useTask(taskId)` : Hook pour récupérer une tâche par ID
- `useNotifications()` : Hook pour récupérer les notifications
- `useMarkNotificationAsRead()` : Hook pour marquer une notification comme lue
- `useUser()` : Hook pour récupérer l'utilisateur actuel

**Important** : Les hooks ne connaissent pas la différence entre mocks et vraies API. Ils appellent simplement les fonctions API définies dans `/src/api/*.ts`.

## Comment remplacer les mocks par la vraie API

### Étape 1 : Mettre à jour le flag

**Fichier** : `/src/config/environment.ts`

```typescript
export const USE_MOCK_API = false; // Passer à false
```

### Étape 2 : Implémenter les vraies fonctions API

**Fichiers** : `/src/api/*.ts`

Remplacer les sections `if (USE_MOCK_API)` par les vrais appels HTTP :

```typescript
// Avant (mock)
if (USE_MOCK_API) {
  return mockTasks.getMyTasks(filter);
}

// Après (vraie API)
const path = `/me/tasks?status=${filter}`;
if (!_accessToken) throw new Error('Access token required');
return apiFetch<Task[]>(path, {}, _accessToken);
```

### Étape 3 : Adapter les signatures si nécessaire

Si les vraies API Suivi ont des signatures différentes, adapter les fonctions dans `/src/api/*.ts` pour garder la compatibilité avec les hooks existants.

### Étape 4 : Tester chaque endpoint

1. Tester les appels API un par un
2. Vérifier que les hooks React Query fonctionnent correctement
3. Vérifier que les écrans s'affichent correctement avec les vraies données

## Architecture de données

### Stockage en mémoire

Les mocks utilisent des **tableaux en mémoire** (`let MOCK_TASKS: Task[] = [...]`). 

**Important** :
- Les modifications (updateTaskStatus, markNotificationRead, etc.) modifient directement ces tableaux
- Les données sont **perdues** au redémarrage de l'app
- Pour tester la persistance, il faudra utiliser la vraie API ou AsyncStorage

### Simulation de délai réseau

Toutes les fonctions mock utilisent un `delay()` pour simuler les appels réseau réels (150-300ms).

## Points d'extension futurs

### 1. Quick Capture → Vraie création de tâche

**Actuel** : `quickCapture(text)` crée une tâche simple dans le mock

**Futur** : Appeler `POST /api/tasks` avec les données complètes de la tâche Suivi

**Fichier à modifier** : `/src/api/tasks.ts` → fonction `quickCapture()`

### 2. Notifications Push

**Actuel** : Notifications mockées en mémoire

**Futur** : Intégrer avec le système de notifications push Suivi

**Fichiers à créer** :
- `/src/services/pushNotifications.ts`
- Configuration Expo Notifications

### 3. Synchronisation offline

**Actuel** : Pas de synchronisation offline

**Futur** : Utiliser AsyncStorage ou SQLite pour stocker les données localement et synchroniser avec l'API Suivi

## Fichiers à ne PAS modifier lors de la migration

- `/src/hooks/*.ts` : Les hooks doivent rester identiques
- `/src/screens/*.tsx` : Les écrans ne doivent pas être modifiés
- `/src/components/*.tsx` : Les composants UI ne doivent pas être modifiés

## Fichiers à modifier lors de la migration

- `/src/config/environment.ts` : Passer `USE_MOCK_API = false`
- `/src/api/*.ts` : Implémenter les vraies fonctions API
- `/src/api/client.ts` : Configurer l'URL de base de l'API Suivi

## Documentation complémentaire

- **API Contract** : `docs/mobile/api-contract.md` - Contrats d'API détaillés
- **Architecture** : `docs/mobile/README.md` - Vue d'ensemble de l'architecture


