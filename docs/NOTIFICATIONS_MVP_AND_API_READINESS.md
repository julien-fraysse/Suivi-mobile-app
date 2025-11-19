# Notifications MVP & API Readiness

## Vue d'ensemble

Ce document décrit l'implémentation MVP du système de notifications dans Suivi Mobile App, ainsi que la structure prête pour l'intégration API Suivi Desktop.

---

## MVP Scope

### Flux utilisateur

1. **NotificationsScreen** → Liste des notifications (toutes / non lues)
2. **NotificationDetailScreen** → Détails d'une notification + quick actions
3. **TaskDetailScreen** → Navigation depuis les quick actions si applicable

### Types de notifications supportés

| Type | Description | Quick Actions |
|------|-------------|---------------|
| `task_assigned` | Nouvelle tâche assignée | Voir la tâche, Marquer comme lu |
| `comment` | Nouveau commentaire | Réponse rapide, Voir la tâche |
| `mention_in_comment` | Mention dans un commentaire | Réponse rapide, Voir la tâche |
| `status_changed` | Statut modifié | Voir la tâche, Marquer comme lu |
| `task_due_today` | Tâche due aujourd'hui | Voir la tâche, Marquer comme lu |
| `task_overdue` | Tâche en retard | Voir la tâche, Marquer comme lu |

### Structure des données (Mock)

```typescript
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO string
  relatedTaskId?: string | null; // ID de la tâche liée
  projectId?: string; // ID du projet lié (futur)
  actor?: {
    id?: string;
    name?: string;
    avatarUrl?: string;
  };
}
```

### Mock dataset

Le mock dataset est défini dans `src/features/notifications/notificationsStore.tsx` :

- **INITIAL_NOTIFICATIONS** : Liste de notifications mockées
- **NotificationsProvider** : Context Provider pour l'état global
- **useNotificationsStore()** : Hook pour accéder aux notifications

---

## API Readiness

### Endpoints futurs à brancher

| Action | API future | Facile ? | Notes |
|--------|------------|----------|-------|
| **Mark as read** | `PATCH /notifications/:id/read` | ⭐️⭐️⭐️⭐️⭐️ | `markAsRead()` déjà prêt |
| **Mark all as read** | `PATCH /notifications/read-all` | ⭐️⭐️⭐️⭐️⭐️ | `markAllAsRead()` déjà prêt |
| **Quick reply comment** | `POST /tasks/:id/comments` | ⭐️⭐️⭐️⭐️ | Handler `handleSendReply()` prêt |
| **Approve / Reject** | `POST /approvals/:id/decision` | ⭐️⭐️⭐️ | À implémenter (futur) |
| **Open task detail** | `GET /tasks/:id` | ⭐️⭐️⭐️⭐️⭐️ | `useTaskById()` déjà utilisé |
| **Load task summary** | `GET /tasks/:id?fields=summary` | ⭐️⭐️⭐️⭐️⭐️ | `useTaskById()` extensible |
| **Load actor info** | `GET /users/:id` | ⭐️⭐️⭐️⭐️⭐️ | `actor` déjà dans la structure |

### Points d'intégration

#### 1. NotificationsProvider (`src/features/notifications/notificationsStore.tsx`)

**État actuel** : Mock avec `useState`

**Intégration future** :
```typescript
// Remplacer useState par useQuery (React Query)
const { data: notifications, refetch } = useQuery('notifications', () =>
  api.get('/notifications')
);

// Remplacer markAsRead par mutation
const markAsReadMutation = useMutation(
  (id: string) => api.patch(`/notifications/${id}/read`),
  { onSuccess: () => refetch() }
);
```

**Impact** : ⭐️⭐️⭐️⭐️⭐️ (Très facile)
- Structure déjà prête
- Pas de refactor majeur nécessaire
- Provider déjà en place dans `App.tsx`

#### 2. NotificationDetailScreen (`src/screens/NotificationDetailScreen.tsx`)

**État actuel** : 100% mock, données depuis `useNotificationsStore()`

**Intégration future** :
```typescript
// Remplacer useNotificationsStore() par useQuery
const { data: notification } = useQuery(
  ['notification', id],
  () => api.get(`/notifications/${id}`)
);

// Remplacer handleSendReply par mutation
const sendReplyMutation = useMutation(
  (body: string) => api.post(`/tasks/${taskId}/comments`, { body }),
  { onSuccess: () => navigation.navigate('TaskDetail', { taskId }) }
);
```

**Impact** : ⭐️⭐️⭐️⭐️ (Facile)
- Structure modulaire par type
- Quick actions isolées
- Pas de changement de navigation

#### 3. Quick Actions

**État actuel** : Handlers mockés avec `setTimeout`

**Intégration future** :
- `handleMarkAsRead()` → `PATCH /notifications/:id/read`
- `handleSendReply()` → `POST /tasks/:id/comments`
- `handleViewTask()` → Déjà fonctionnel (navigation)

**Impact** : ⭐️⭐️⭐️⭐️ (Facile)
- Handlers déjà structurés
- Pas de changement UI nécessaire

---

## Structure des composants

### NotificationDetailScreen

**Fichier** : `src/screens/NotificationDetailScreen.tsx`

**Structure** :
1. **Header** : Titre dynamique selon `notification.type`
2. **Bloc principal** : Avatar + nom acteur, message, date
3. **Bloc "Lié à"** : Tâche liée (si `relatedTaskId` existe)
4. **Quick Actions** : Actions selon le type

**Modularité** :
- Quick actions conditionnelles selon `notification.type`
- Facile à étendre pour nouveaux types (`review_request`, `approval`, `question`, etc.)

### NotificationsScreen

**Fichier** : `src/screens/NotificationsScreen.tsx`

**Navigation** :
- `onPress` → `navigation.navigate('NotificationDetail', { id })`
- Plus de navigation directe vers `TaskDetail`

### NotificationsProvider

**Fichier** : `src/features/notifications/notificationsStore.tsx`

**Fonctionnalités** :
- État global des notifications
- `markAsRead(id)` : Marquer une notification comme lue
- `markAllAsRead()` : Marquer toutes comme lues
- Hook `useNotificationsStore()` : Accès à l'état

---

## Extensibilité

### Ajouter un nouveau type de notification

1. **Ajouter le type** dans `NotificationType` :
```typescript
export type NotificationType =
  | 'task_assigned'
  | 'comment'
  | 'mention_in_comment'
  | 'status_changed'
  | 'task_due_today'
  | 'task_overdue'
  | 'review_request' // Nouveau type
  | 'approval' // Nouveau type
```

2. **Ajouter la traduction** dans `fr.json` et `en.json` :
```json
{
  "notifications": {
    "reviewRequest": "Demande de review",
    "approval": "Demande d'approbation"
  }
}
```

3. **Ajouter le titre** dans `NotificationDetailScreen.getNotificationTitle()` :
```typescript
case 'review_request':
  return t('notifications.reviewRequest');
```

4. **Ajouter les quick actions** dans `NotificationDetailScreen` :
```typescript
{notification.type === 'review_request' && (
  <View style={styles.actionButtons}>
    <Pressable onPress={handleApprove}>Approuver</Pressable>
    <Pressable onPress={handleReject}>Rejeter</Pressable>
  </View>
)}
```

**Impact** : ⭐️⭐️⭐️⭐️⭐️ (Très facile)
- Structure modulaire
- Pas de refactor nécessaire
- Extensible sans casser l'existant

---

## Checklist d'intégration API

### Phase 1 : Endpoints de base

- [ ] `GET /notifications` → Remplacer `INITIAL_NOTIFICATIONS`
- [ ] `PATCH /notifications/:id/read` → Remplacer `markAsRead()` mock
- [ ] `PATCH /notifications/read-all` → Remplacer `markAllAsRead()` mock

### Phase 2 : Détails et actions

- [ ] `GET /notifications/:id` → Remplacer `useNotificationsStore().notifications.find()`
- [ ] `POST /tasks/:id/comments` → Remplacer `handleSendReply()` mock
- [ ] `GET /users/:id` → Remplacer `actor` mock (si nécessaire)

### Phase 3 : Extensions

- [ ] `POST /approvals/:id/decision` → Implémenter approve/reject
- [ ] `GET /notifications/unread-count` → Optimiser badge bottom bar
- [ ] WebSocket pour notifications en temps réel

---

## Notes techniques

### Provider order dans App.tsx

L'ordre des providers est important :

```typescript
<I18nextProvider>
  <GestureHandlerRootView>
    <SafeAreaProvider>
      <QueryClientProvider> {/* Pour futures mutations API */}
        <SettingsProvider>
          <ThemeProvider>
            <AuthProvider>
              <TasksProvider>
                <NotificationsProvider> {/* Doit être après AuthProvider */}
                  <AppContent />
                </NotificationsProvider>
              </TasksProvider>
            </AuthProvider>
          </ThemeProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
</I18nextProvider>
```

### Navigation

**Stack** : `AppStack` (RootNavigator)

**Routes** :
- `NotificationDetail: { id: string }`
- `TaskDetail: { taskId: string }` (depuis quick actions)

**Pas de changement** : La navigation reste identique, seule la route intermédiaire change.

---

## Résumé

✅ **MVP complet** : NotificationDetailScreen fonctionnel avec quick actions  
✅ **API Ready** : Structure prête pour intégration sans refactor majeur  
✅ **Extensible** : Facile d'ajouter de nouveaux types de notifications  
✅ **Documenté** : Code commenté, structure claire  

**Prochaine étape** : Brancher les endpoints Suivi Desktop API selon la checklist ci-dessus.

