# Notifications ↔ Tâches : Lien et Cohérence

**Date** : 2024-11-20  
**Objectif** : Documenter la mécanique de liaison entre notifications et tâches, et les règles de cohérence

---

## 1. Source Unique de Vérité

Toutes les données mockées (tâches + notifications) proviennent de :

```
src/mocks/suiviData.ts
```

**RÈGLE ABSOLUE** :
- Aucune autre source de données mock ne doit rester active
- Les notifications doivent obligatoirement pointer vers une tâche réelle
- `relatedTaskId` doit toujours correspondre à un ID de `TASKS`
- Chaque notification doit être cohérente avec la `quickAction` de la tâche cible

---

## 2. Structure des Données

### 2.1. Tâches (`TASKS`)

Chaque tâche dans `TASKS` possède :
- `id`: string numérique ('1', '2', ..., '10')
- `title`: string
- `status`: 'todo' | 'in_progress' | 'blocked' | 'done'
- `dueDate`: string ISO (YYYY-MM-DD)
- `quickAction`: objet avec `actionType` et `uiHint`

**Exemple** :
```typescript
{
  id: '1',
  title: 'Répondre à un commentaire sur le design system',
  status: 'in_progress',
  dueDate: '2024-11-20',
  projectName: 'Mobile App',
  assigneeName: 'Julien',
  quickAction: {
    actionType: "COMMENT",
    uiHint: "comment_input",
  },
}
```

### 2.2. Notifications (`NOTIFICATIONS`)

Chaque notification dans `NOTIFICATIONS` possède :
- `id`: string unique
- `type`: `NotificationType` ('task_assigned', 'comment', 'mention_in_comment', 'status_changed', 'task_due_today', 'task_overdue')
- `title`: string
- `message`: string
- `read`: boolean
- `createdAt`: string ISO
- `relatedTaskId`: string numérique qui DOIT correspondre à un `id` de `TASKS`
- `actor`: objet optionnel (présent pour les actions humaines)

**Exemple** :
```typescript
{
  id: 'notif-comment-1',
  type: 'comment',
  title: 'Nouveau commentaire',
  message: 'Alice a commenté sur "Répondre à un commentaire sur le design system"',
  read: false,
  createdAt: '2024-11-16T11:30:00Z',
  relatedTaskId: '1', // ✅ Pointe vers TASKS[0] (id: '1')
  actor: {
    id: 'user-alice',
    name: 'Alice Dupont',
    avatarUrl: 'https://i.pravatar.cc/300?img=33',
  },
}
```

---

## 3. Règles de Cohérence Notification ↔ QuickAction

### 3.1. Notifications de Type `comment` ou `mention_in_comment`

**Règle** : DOIVENT pointer vers une tâche avec `quickAction.actionType === "COMMENT"`

**Raison** : Ces notifications signalent une action sur un commentaire, donc la tâche doit permettre de répondre via une Quick Action COMMENT.

**Exemple** :
- ✅ Notification `notif-comment-1` (type: 'comment') → Tâche ID '1' avec `quickAction.actionType: "COMMENT"`
- ✅ Notification `notif-mention-1` (type: 'mention_in_comment') → Tâche ID '1' avec `quickAction.actionType: "COMMENT"`

**Incorrect** :
- ❌ Notification `notif-comment-1` (type: 'comment') → Tâche ID '3' avec `quickAction.actionType: "RATING"`

---

### 3.2. Notifications de Type `task_assigned`

**Règle** : DOIVENT pointer vers une tâche avec `quickAction.actionType === "COMMENT"` ou `"APPROVAL"`

**Raison** : Les notifications "assigned" concernent généralement des tâches qui nécessitent une action directe (commenter ou approuver).

**Exemple** :
- ✅ Notification `notif-assigned-1` (type: 'task_assigned') → Tâche ID '2' avec `quickAction.actionType: "APPROVAL"`
- ✅ Notification `notif-weather-1` (type: 'task_assigned') → Tâche ID '5' avec `quickAction.actionType: "WEATHER"` (exception, car demande spécifique)

---

### 3.3. Notifications de Type `status_changed`

**Règle** : PEUVENT pointer vers n'importe quelle tâche

**Raison** : Le changement de statut est un événement système qui peut concerner n'importe quelle tâche.

**Exemple** :
- ✅ Notification `notif-status-1` (type: 'status_changed') → Tâche ID '8' avec `quickAction.actionType: "SELECT"`

---

### 3.4. Notifications de Type `task_due_today`

**Règle** : DOIVENT pointer vers une tâche avec `dueDate === aujourd'hui`

**Raison** : Ces notifications sont générées automatiquement par le système pour les tâches qui arrivent à échéance aujourd'hui.

**Exemple** :
- ✅ Notification `notif-due-today` (type: 'task_due_today') → Tâche ID '9' avec `dueDate: '2024-11-20'` (aujourd'hui)

---

### 3.5. Notifications de Type `task_overdue`

**Règle** : DOIVENT pointer vers une tâche avec `dueDate < aujourd'hui` et `status !== 'done'`

**Raison** : Ces notifications sont générées automatiquement par le système pour les tâches en retard.

**Exemple** :
- ✅ Notification `notif-overdue` (type: 'task_overdue') → Tâche ID '10' avec `dueDate: '2024-11-10'` (date passée) et `status: 'blocked'`

---

## 4. Comment Créer une Notification Cohérente

### 4.1. Étape 1 : Identifier la Tâche Cible

1. **Parcourir `TASKS`** pour trouver la tâche appropriée selon le type de notification
2. **Vérifier la `quickAction`** de la tâche pour s'assurer de la cohérence
3. **Noter l'`id` de la tâche** (ex: '1', '2', ..., '10')

### 4.2. Étape 2 : Créer la Notification

```typescript
{
  id: 'notif-<type>-<numéro>', // Ex: 'notif-comment-1'
  type: '<NotificationType>',   // Ex: 'comment'
  title: 'Titre de la notification',
  message: 'Message décrivant l\'action',
  read: false,
  createdAt: '2024-11-20T10:00:00Z',
  relatedTaskId: '<id-de-la-tache>', // Ex: '1'
  actor: {                        // Optionnel, présent pour les actions humaines
    id: 'user-<id>',
    name: 'Nom de l\'acteur',
    avatarUrl: 'https://i.pravatar.cc/300?img=<numéro>',
  },
}
```

### 4.3. Étape 3 : Vérifier la Cohérence

1. **Exécuter `validateDataIntegrity()`** pour détecter les incohérences
2. **Vérifier manuellement** :
   - `relatedTaskId` correspond à un `id` de `TASKS`
   - Le type de notification est cohérent avec la `quickAction` de la tâche
   - L'`actor` est présent pour les actions humaines (pas pour les événements système)

### 4.4. Exemple Complet : Créer une Notification "Comment"

**Objectif** : Créer une notification de type `comment` pour la tâche ID '1' (quickAction: COMMENT)

```typescript
{
  id: 'notif-comment-1',
  type: 'comment',
  title: 'Nouveau commentaire',
  message: 'Alice a commenté sur "Répondre à un commentaire sur le design system"',
  read: false,
  createdAt: '2024-11-16T11:30:00Z',
  relatedTaskId: '1', // ✅ Pointe vers TASKS[0] avec quickAction COMMENT
  actor: {
    id: 'user-alice',
    name: 'Alice Dupont',
    avatarUrl: 'https://i.pravatar.cc/300?img=33',
  },
}
```

**Vérification** :
- ✅ `relatedTaskId: '1'` correspond à une tâche existante
- ✅ La tâche ID '1' a `quickAction.actionType: "COMMENT"`
- ✅ Le type de notification (`comment`) est cohérent avec la `quickAction` (COMMENT)
- ✅ L'`actor` est présent (action humaine)

---

## 5. Mapping Backend → Frontend

### 5.1. Structure API Backend Attendue

Lorsque l'API backend sera prête, les endpoints suivants devront renvoyer :

#### GET /api/tasks

**Réponse attendue** :
```json
{
  "items": [
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
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 10
}
```

#### GET /api/notifications

**Réponse attendue** :
```json
[
  {
    "id": "notif-comment-1",
    "type": "comment",
    "title": "Nouveau commentaire",
    "message": "Alice a commenté sur \"Répondre à un commentaire sur le design system\"",
    "read": false,
    "createdAt": "2024-11-16T11:30:00Z",
    "relatedTaskId": "1",
    "actor": {
      "id": "user-alice",
      "name": "Alice Dupont",
      "avatarUrl": "https://i.pravatar.cc/300?img=33"
    }
  }
]
```

### 5.2. Validation Côté Backend

Le backend DOIT garantir :
1. **Intégrité référentielle** : Tous les `relatedTaskId` dans les notifications correspondent à des tâches existantes
2. **Cohérence** : Les notifications de type `comment` ou `mention_in_comment` pointent vers des tâches avec `quickAction.actionType === "COMMENT"`
3. **Format des IDs** : Les IDs sont des strings numériques (compatibles avec UUID si nécessaire)

---

## 6. Migration de `suiviData.ts` vers l'API

### 6.1. Étapes de Migration

1. **Modifier `src/mocks/suiviData.ts`** :
   - Remplacer `loadTasks()` par un appel à `GET /api/tasks`
   - Remplacer `loadNotifications()` par un appel à `GET /api/notifications`

2. **Adapter les Contexts** :
   - `TasksContext.tsx` : Remplacer `loadMockTasks()` par `api.getTasks(accessToken)`
   - `NotificationsStore.tsx` : Remplacer `loadNotifications()` par `api.getNotifications(accessToken)`

3. **Gestion d'erreur** :
   - Ajouter retry logic pour les appels API
   - Gérer les états loading/error/success
   - Fallback vers données en cache si API indisponible

### 6.2. Structure de Code (Avant/Après)

**Avant (Mock)** :
```typescript
// src/mocks/suiviData.ts
export async function loadTasks(): Promise<Task[]> {
  await delay(300);
  return [...TASKS];
}
```

**Après (API)** :
```typescript
// src/api/tasks.ts
export async function getTasks(accessToken: string): Promise<MyTasksPage> {
  const response = await apiFetch<MyTasksPage>('/api/tasks', {}, accessToken);
  return response;
}
```

**Utilisation dans Context** :
```typescript
// src/tasks/TasksContext.tsx
const loadTasks = useCallback(async () => {
  try {
    const response = await api.getTasks(accessToken);
    setTasks(response.items);
  } catch (err) {
    // Gestion d'erreur
  }
}, [accessToken]);
```

---

## 7. Validation Automatique

### 7.1. Fonction `validateDataIntegrity()`

Cette fonction est appelée automatiquement au chargement de `suiviData.ts` et vérifie :

1. **Existence des tâches** : Tous les `relatedTaskId` correspondent à des tâches existantes
2. **Cohérence QuickAction** : Les notifications de type `comment`/`mention_in_comment` pointent vers des tâches avec `quickAction.actionType === "COMMENT"`

**Exemple d'erreur détectée** :
```
Notification "notif-comment-1" (type: comment) pointe vers une tâche avec quickAction "RATING" au lieu de "COMMENT"
```

### 7.2. Utilisation en Développement

```typescript
// src/mocks/suiviData.ts
const validationResult = validateDataIntegrity();
if (!validationResult.valid) {
  console.warn('[suiviData.ts] Erreurs de validation détectées:', validationResult.errors);
}
```

---

## 8. Checklist de Création de Notification

Lors de la création d'une nouvelle notification, vérifier :

- [ ] **ID unique** : L'`id` de la notification est unique dans `NOTIFICATIONS`
- [ ] **Tâche existante** : Le `relatedTaskId` correspond à un `id` de `TASKS`
- [ ] **Type cohérent** : Le `type` de notification est cohérent avec la `quickAction` de la tâche
- [ ] **Actor présent** : L'`actor` est présent pour les actions humaines (pas pour les événements système)
- [ ] **Dates cohérentes** : Pour `task_due_today`, la `dueDate` de la tâche = aujourd'hui
- [ ] **Dates cohérentes** : Pour `task_overdue`, la `dueDate` de la tâche < aujourd'hui
- [ ] **Validation passée** : `validateDataIntegrity()` retourne `valid: true`

---

## 9. Navigation Notification → TaskDetail

### 9.1. Flux Actuel

1. **NotificationItem** reçoit une notification avec `relatedTaskId`
2. **Vérification** : `getTaskByIdStrict(relatedTaskId)` vérifie que la tâche existe
3. **Navigation** : Si la tâche existe, `navigation.navigate('TaskDetail', { taskId })`
4. **Fallback** : Si la tâche n'existe pas, afficher `Alert.alert('Tâche introuvable')`

### 9.2. Code dans NotificationItem.tsx

```typescript
const handleNotificationClick = () => {
  // 1. Marquer comme lue
  if (!notification.read) {
    markAsRead(notification.id);
  }
  
  // 2. Vérifier que la tâche existe
  const taskId = notification.relatedTaskId;
  if (!taskId) {
    Alert.alert('Tâche introuvable', 'Cette notification n\'est pas liée à une tâche.');
    return;
  }
  
  // 3. Vérifier l'existence via TasksContext
  const task = getTaskByIdStrict(taskId);
  if (!task) {
    Alert.alert('Tâche introuvable', 'Cette tâche n\'existe plus ou a été supprimée.');
    return;
  }
  
  // 4. Navigation
  navigation.navigate('TaskDetail', { taskId });
};
```

### 9.3. Garanties

- ✅ **Aucune navigation invalide** : Vérification préalable de l'existence de la tâche
- ✅ **Feedback utilisateur** : Alert claire si la tâche n'existe pas
- ✅ **État à jour** : Notification marquée comme lue immédiatement

---

## 10. Exemples de Notifications Cohérentes

### 10.1. Set Complet Actuel (8 notifications)

| ID Notification | Type | RelatedTaskId | QuickAction Cible | Cohérence |
|----------------|------|---------------|-------------------|-----------|
| `notif-assigned-1` | `task_assigned` | '2' | APPROVAL | ✅ |
| `notif-comment-1` | `comment` | '1' | COMMENT | ✅ |
| `notif-mention-1` | `mention_in_comment` | '1' | COMMENT | ✅ |
| `notif-status-1` | `status_changed` | '8' | SELECT | ✅ |
| `notif-rating-1` | `comment` | '3' | RATING | ✅ |
| `notif-weather-1` | `task_assigned` | '5' | WEATHER | ✅ |
| `notif-due-today` | `task_due_today` | '9' | CALENDAR | ✅ |
| `notif-overdue` | `task_overdue` | '10' | CALENDAR | ✅ |

---

## 11. Règles Immuables

1. **Source unique** : `src/mocks/suiviData.ts` est la seule source de vérité
2. **Intégrité référentielle** : Aucune notification ne doit pointer vers une tâche inexistante
3. **Cohérence sémantique** : Les notifications de type `comment`/`mention_in_comment` doivent pointer vers des tâches avec `quickAction.actionType === "COMMENT"`
4. **Validation automatique** : `validateDataIntegrity()` doit passer sans erreurs
5. **Navigation fiable** : Aucune navigation ne doit finir en "Task not found"

---

## 12. Prochaines Étapes

1. **Intégration API** : Remplacer `loadTasks()` et `loadNotifications()` par des appels API réels
2. **Validation Backend** : Implémenter la validation côté backend pour garantir l'intégrité
3. **Tests** : Ajouter des tests unitaires pour vérifier la cohérence des données
4. **Documentation API** : Documenter les contrats API dans `docs/mobile/api-contract.md`

---

**Document créé automatiquement**  
**Dernière mise à jour** : 2024-11-20

