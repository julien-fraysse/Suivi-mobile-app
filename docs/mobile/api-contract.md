# Contrats d'API Mobile Suivi

## Introduction

Ce document décrit les contrats d'API attendus côté mobile pour intégrer le backend Suivi. Les contrats sont déduits des types TypeScript et fonctions existantes dans `/src/api/`.

**Note importante** : Les endpoints exacts (URLs, structures de réponse, etc.) doivent être confirmés avec l'équipe backend Suivi.

## Architecture de l'API Client

**Fichier** : `/src/api/client.ts`

**Fonction principale** : `apiFetch<T>(path, init, accessToken)`

**Comportement** :
- Construit l'URL : `API_BASE_URL + path`
- Ajoute automatiquement `Authorization: Bearer <token>` si `accessToken` est fourni
- Ajoute `Content-Type: application/json` par défaut (sauf pour FormData)
- Parse JSON et retourne `Promise<T>`
- Lance une erreur si `response.ok === false`

**Exemple d'utilisation** :
```typescript
const response = await apiFetch<MyResponse>('/me/tasks', {
  method: 'GET',
}, accessToken);
```

## Base URL

**Actuel** : `https://api.suivi.local` (placeholder)

**Futur** : URL réelle du backend Suivi (à confirmer)
- Production : `https://api.suivi.com` (exemple)
- Staging : `https://api-staging.suivi.com` (exemple)
- Dev : `https://api-dev.suivi.com` (exemple)

**Configuration** : À définir dans un fichier de configuration d'environnement.

## Authentification

### Format

Tous les appels API authentifiés doivent inclure le token dans les headers :

```
Authorization: Bearer <access_token>
```

### Gestion des tokens

- **Access Token** : Stocké dans `SecureStore` (clé : `'access_token'`)
- **Refresh Token** : Non implémenté actuellement (à prévoir)

### Erreurs d'authentification

- **401 Unauthorized** : Token manquant ou invalide
  - **Action** : Déconnecter l'utilisateur et rediriger vers LoginScreen
- **403 Forbidden** : Token valide mais permissions insuffisantes
  - **Action** : Afficher un message d'erreur

## Domaines d'API

### 1. Authentification (Auth)

#### Login

**Actuel (Mock)** : Token généré localement dans `AuthProvider.signIn()`

**Futur** :

**Endpoint** : `POST /api/auth/login`

**Request Body** :
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** :
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "..." // Optionnel
}
```

**Code** :
```typescript
// Dans /src/auth/AuthProvider.tsx
async function signIn(email: string, password: string): Promise<void> {
  const response = await apiFetch<{ accessToken: string; refreshToken?: string }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  );
  
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.accessToken);
  if (response.refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refreshToken);
  }
  
  setAccessToken(response.accessToken);
}
```

**Erreurs** :
- `400 Bad Request` : Email ou password manquant/invalide
- `401 Unauthorized` : Email ou password incorrect
- `500 Internal Server Error` : Erreur serveur

---

#### Logout

**Actuel** : Suppression locale du token

**Futur (optionnel)** :

**Endpoint** : `POST /api/auth/logout`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Response** :
```json
{
  "success": true
}
```

**Code** :
```typescript
// Dans /src/auth/AuthProvider.tsx
async function signOut(): Promise<void> {
  const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  
  if (accessToken) {
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
      }, accessToken);
    } catch (error) {
      // Log l'erreur mais continue la déconnexion locale
      console.warn('Error calling logout API:', error);
    }
  }
  
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  setAccessToken(null);
}
```

---

#### Refresh Token (À implémenter)

**Endpoint** : `POST /api/auth/refresh`

**Request Body** :
```json
{
  "refreshToken": "..."
}
```

**Response** :
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "..." // Optionnel (rotation de refresh token)
}
```

**Utilisation** : Appelé automatiquement quand un `401` est retourné.

---

#### Get Current User

**Fichier à créer** : `/src/api/auth.ts`

**Endpoint** : `GET /api/me`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Response** :
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://...", // Optionnel
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Code** :
```typescript
// Dans /src/api/auth.ts
export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export async function getCurrentUser(
  accessToken: string,
): Promise<User> {
  const path = '/me';
  return apiFetch<User>(path, {}, accessToken);
}
```

---

### 2. Tasks (Tâches)

**Fichier** : `/src/api/tasks.ts`

**Note importante** : Utilise le flag `USE_MOCK_API` pour basculer entre mocks et vraies API.

#### Get My Tasks

**Fonction API** : `getMyTasks(accessToken?, params)`

**Endpoint** : `GET /api/me/tasks`

**Implémentation** : 
- Si `USE_MOCK_API = true` : Utilise `src/mocks/data/tasks.ts`
- Si `USE_MOCK_API = false` : Appelle l'endpoint Suivi réel

**Headers** :
```
Authorization: Bearer <access_token>
```

**Query Params** :
- `page` : Numéro de page (défaut : 1)
- `pageSize` : Nombre d'éléments par page (défaut : 20)
- `status` : Filtre par statut (optionnel) - `todo` | `in_progress` | `blocked` | `done`

**Response** :
```json
{
  "items": [
    {
      "id": "task-123",
      "title": "Tâche exemple",
      "status": "todo",
      "dueDate": "2024-12-31T23:59:59Z", // ISO 8601
      "projectName": "Projet A",
      "assigneeName": "John Doe",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 100
}
```

**Types** :
```typescript
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: string | null; // ISO 8601
  projectName?: string | null;
  assigneeName?: string | null;
  updatedAt?: string; // ISO 8601
};

export type MyTasksFilters = {
  status?: TaskStatus | 'all';
};

export type MyTasksPage = {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
};
```

**Code** :
```typescript
export async function getMyTasks(
  accessToken: string,
  params: { page?: number; pageSize?: number; filters?: MyTasksFilters } = {},
): Promise<MyTasksPage> {
  const { page = 1, pageSize = 20, filters } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(pageSize));

  if (filters?.status && filters.status !== 'all') {
    searchParams.set('status', filters.status);
  }

  const path = `/me/tasks?${searchParams.toString()}`;
  return apiFetch<MyTasksPage>(path, {}, accessToken);
}
```

**Erreurs** :
- `401 Unauthorized` : Token invalide
- `500 Internal Server Error` : Erreur serveur

---

#### Get Task By ID

**Fonction API** : `getTaskById(taskId, accessToken?)`

**Endpoint** : `GET /api/tasks/{id}`

**Implémentation** : 
- Si `USE_MOCK_API = true` : Utilise `src/mocks/data/tasks.ts`
- Si `USE_MOCK_API = false` : Appelle l'endpoint Suivi réel

**Headers** :
```
Authorization: Bearer <access_token>
```

**Path Params** :
- `id` : ID de la tâche

**Response** :
```json
{
  "id": "task-123",
  "title": "Tâche exemple",
  "status": "todo",
  "dueDate": "2024-12-31T23:59:59Z",
  "projectName": "Projet A",
  "assigneeName": "John Doe",
  "updatedAt": "2024-01-01T00:00:00Z",
  "description": "Description détaillée de la tâche", // Optionnel
  "createdAt": "2024-01-01T00:00:00Z" // Optionnel
}
```

**Code** :
```typescript
export async function getTaskById(
  accessToken: string,
  taskId: string,
): Promise<Task> {
  const path = `/tasks/${encodeURIComponent(taskId)}`;
  return apiFetch<Task>(path, {}, accessToken);
}
```

**Erreurs** :
- `401 Unauthorized` : Token invalide
- `404 Not Found` : Tâche non trouvée
- `500 Internal Server Error` : Erreur serveur

---

#### Create Task (À implémenter)

**Endpoint** : `POST /api/tasks`

**Headers** :
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body** :
```json
{
  "title": "Nouvelle tâche",
  "description": "Description", // Optionnel
  "status": "todo",
  "dueDate": "2024-12-31T23:59:59Z", // Optionnel
  "projectId": "project-123", // Optionnel
  "assigneeId": "user-123" // Optionnel
}
```

**Response** :
```json
{
  "id": "task-456",
  "title": "Nouvelle tâche",
  "status": "todo",
  "dueDate": "2024-12-31T23:59:59Z",
  "projectName": "Projet A",
  "assigneeName": "John Doe",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

#### Update Task (À implémenter)

**Endpoint** : `PUT /api/tasks/{id}` ou `PATCH /api/tasks/{id}`

**Headers** :
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Params** :
- `id` : ID de la tâche

**Request Body** :
```json
{
  "title": "Tâche modifiée", // Optionnel
  "status": "in_progress", // Optionnel
  "dueDate": "2024-12-31T23:59:59Z", // Optionnel
  "assigneeId": "user-456" // Optionnel
}
```

**Response** : Même format que Get Task By ID

---

#### Delete Task (À implémenter)

**Endpoint** : `DELETE /api/tasks/{id}`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Path Params** :
- `id` : ID de la tâche

**Response** :
```json
{
  "success": true
}
```

---

#### Update Task Status

**Fonction API** : `updateTaskStatus(taskId, newStatus, accessToken?)`

**Endpoint** : `PATCH /api/tasks/{id}/status`

**Headers** :
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Params** :
- `id` : ID de la tâche

**Request Body** :
```json
{
  "status": "in_progress" // "todo" | "in_progress" | "blocked" | "done"
}
```

**Response** : Même format que Get Task By ID

**Implémentation** : 
- Si `USE_MOCK_API = true` : Utilise `src/mocks/data/tasks.ts` (mutation du mock array)
- Si `USE_MOCK_API = false` : Appelle l'endpoint Suivi réel

---

#### Get My Priorities

**Fonction API** : `getMyPriorities(accessToken?)`

**Endpoint** : `GET /api/me/tasks/priorities`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Response** :
```json
[
  {
    "id": "task-123",
    "title": "Task example",
    "status": "todo" // ou "in_progress"
    // ... autres champs Task
  }
]
```

**Implémentation** : 
- Si `USE_MOCK_API = true` : Utilise `src/mocks/data/tasks.ts` (filtre todo + in_progress)
- Si `USE_MOCK_API = false` : Appelle l'endpoint Suivi réel

---

#### Get Due Soon

**Fonction API** : `getDueSoon(accessToken?)`

**Endpoint** : `GET /api/me/tasks/due-soon`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Response** : Même format que Get My Priorities

**Implémentation** : 
- Si `USE_MOCK_API = true` : Utilise `src/mocks/data/tasks.ts` (filtre tâches dues dans les 7 prochains jours)
- Si `USE_MOCK_API = false` : Appelle l'endpoint Suivi réel

---

#### Get Recently Updated

**Fonction API** : `getRecentlyUpdated(accessToken?)`

**Endpoint** : `GET /api/me/tasks/recently-updated`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Response** : Même format que Get My Priorities

**Implémentation** : 
- Si `USE_MOCK_API = true` : Utilise `src/mocks/data/tasks.ts` (tri par updatedAt décroissant)
- Si `USE_MOCK_API = false` : Appelle l'endpoint Suivi réel

---

#### Get Late

**Fonction API** : `getLate(accessToken?)`

**Endpoint** : `GET /api/me/tasks/late`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Response** : Même format que Get My Priorities

**Implémentation** : 
- Si `USE_MOCK_API = true` : Utilise `src/mocks/data/tasks.ts` (filtre tâches en retard)
- Si `USE_MOCK_API = false` : Appelle l'endpoint Suivi réel

---

### 3. Activity (Activité)

**Fichier** : `/src/api/activity.ts`

**Note importante** : Utilise le flag `USE_MOCK_API` pour basculer entre mocks et vraies API.

---

#### Get Activity Feed

**Fonction API** : `getActivityFeed(limit, accessToken?)`

**Endpoint** : `GET /api/me/activity?limit={limit}`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Query Params** :
- `limit` : Nombre d'activités à retourner (défaut : 10)

**Response** :
```json
[
  {
    "id": "activity-1",
    "type": "task_completed",
    "actor": {
      "name": "John Doe",
      "avatarUrl": "https://..."
    },
    "target": {
      "type": "task",
      "id": "task-123",
      "name": "Task example"
    },
    "message": "a complété la tâche",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

**Implémentation** : 
- Si `USE_MOCK_API = true` : Utilise `src/mocks/data/activity.ts`
- Si `USE_MOCK_API = false` : Appelle l'endpoint Suivi réel

---

#### Get Task Activity

**Fonction API** : `getTaskActivity(taskId, accessToken?)`

**Endpoint** : `GET /api/tasks/{id}/activity`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Path Params** :
- `id` : ID de la tâche

**Response** : Même format que Get Activity Feed (filtré par taskId)

**Implémentation** : 
- Si `USE_MOCK_API = true` : Utilise `src/mocks/data/activity.ts` (filtre par taskId)
- Si `USE_MOCK_API = false` : Appelle l'endpoint Suivi réel

---

### 4. Projects (À implémenter)

**Fichier à créer** : `/src/api/projects.ts`

#### Get My Projects

**Endpoint** : `GET /api/me/projects`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Query Params** :
- `page` : Numéro de page (défaut : 1)
- `pageSize` : Nombre d'éléments par page (défaut : 20)

**Response** :
```json
{
  "items": [
    {
      "id": "project-123",
      "name": "Projet A",
      "description": "Description du projet",
      "color": "#0066FF",
      "memberCount": 5,
      "taskCount": 10,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 50
}
```

**Types** (à confirmer) :
```typescript
export type Project = {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  memberCount?: number;
  taskCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectsPage = {
  items: Project[];
  page: number;
  pageSize: number;
  total: number;
};
```

**Code** :
```typescript
export async function getMyProjects(
  accessToken: string,
  params: { page?: number; pageSize?: number } = {},
): Promise<ProjectsPage> {
  const { page = 1, pageSize = 20 } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(pageSize));

  const path = `/me/projects?${searchParams.toString()}`;
  return apiFetch<ProjectsPage>(path, {}, accessToken);
}
```

---

#### Get Project By ID

**Endpoint** : `GET /api/projects/{id}`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Path Params** :
- `id` : ID du projet

**Response** : Même format qu'un item de Get My Projects

---

### 5. Notifications

**Fichier** : `/src/api/notifications.ts`

**Note importante** : Utilise le flag `USE_MOCK_API` pour basculer entre mocks et vraies API.

#### Get My Notifications

**Fonction API** : `getNotifications(accessToken?)`

**Endpoint** : `GET /api/me/notifications`

**Implémentation** : 
- Si `USE_MOCK_API = true` : Utilise `src/mocks/data/notifications.ts`
- Si `USE_MOCK_API = false` : Appelle l'endpoint Suivi réel

**Headers** :
```
Authorization: Bearer <access_token>
```

**Query Params** :
- `page` : Numéro de page (défaut : 1)
- `pageSize` : Nombre d'éléments par page (défaut : 20)
- `read` : Filtre par statut de lecture (optionnel) - `true` | `false`

**Response** :
```json
{
  "items": [
    {
      "id": "notification-123",
      "title": "Nouvelle tâche assignée",
      "message": "Vous avez été assigné à la tâche 'Tâche exemple'",
      "type": "task",
      "read": false,
      "link": "task-123", // ID de la ressource (task, project, etc.)
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 50,
  "unreadCount": 10
}
```

**Types** (à confirmer) :
```typescript
export type NotificationType = 'task' | 'project' | 'mention' | 'system';

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string | null; // ID de la ressource
  createdAt: string;
};

export type NotificationsPage = {
  items: Notification[];
  page: number;
  pageSize: number;
  total: number;
  unreadCount: number;
};
```

**Code** :
```typescript
export async function getMyNotifications(
  accessToken: string,
  params: { page?: number; pageSize?: number; read?: boolean } = {},
): Promise<NotificationsPage> {
  const { page = 1, pageSize = 20, read } = params;
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(pageSize));

  if (read !== undefined) {
    searchParams.set('read', String(read));
  }

  const path = `/me/notifications?${searchParams.toString()}`;
  return apiFetch<NotificationsPage>(path, {}, accessToken);
}
```

---

#### Mark Notification As Read

**Fonction API** : `markNotificationAsRead(notificationId, accessToken?)`

**Endpoint** : `PUT /api/me/notifications/{id}/read`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Path Params** :
- `id` : ID de la notification

**Request Body** (si PATCH) :
```json
{
  "read": true
}
```

**Response** :
```json
{
  "success": true
}
```

---

### 6. Users (Utilisateurs)

**Fichier** : `/src/api/users.ts`

**Note importante** : Utilise le flag `USE_MOCK_API` pour basculer entre mocks et vraies API.

---

#### Get Current User

**Fonction API** : `getUser(accessToken?)`

**Endpoint** : `GET /api/me`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Response** :
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://...", // Optionnel
  "role": "admin" // "user" | "admin"
}
```

**Implémentation** : 
- Si `USE_MOCK_API = true` : Utilise `src/mocks/data/users.ts`
- Si `USE_MOCK_API = false` : Appelle l'endpoint Suivi réel

---

### 7. Quick Capture API (Mobile Inbox)

**Fichier** : `/src/api/quickCapture.ts`

**Note importante** : Cette API est spécifique à l'inbox mobile. Les items Quick Capture sont **SÉPARÉS** des Task et seront convertis en tâches Suivi complètes côté desktop.

**Implémentation actuelle** : Mockée dans `src/mocks/data/quickCapture.ts`. Prête à être remplacée par l'API Suivi réelle.

---

#### Get Quick Capture Items

**Endpoint** : `GET /api/mobile/quick-capture/items`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Response** :
```json
{
  "items": [
    {
      "id": "qc-1",
      "title": "Follow up with client about project timeline",
      "createdAt": "2024-01-01T00:00:00Z",
      "dueDate": "2024-01-06T00:00:00Z", // Optionnel, ISO 8601
      "status": "inbox", // "inbox" | "sent"
      "source": "mobile"
    }
  ]
}
```

**Types** :
```typescript
export type QuickCaptureStatus = 'inbox' | 'sent';

export type QuickCaptureItem = {
  id: string;
  title: string;
  createdAt: string; // ISO 8601
  dueDate?: string | null; // Optionnel, ISO 8601
  status: QuickCaptureStatus;
  source: 'mobile';
};

export type QuickCaptureItemsResponse = {
  items: QuickCaptureItem[];
};
```

**Code** :
```typescript
export async function getQuickCaptureItems(
  accessToken: string,
): Promise<QuickCaptureItem[]> {
  const path = '/mobile/quick-capture/items';
  const response = await apiFetch<QuickCaptureItemsResponse>(path, {}, accessToken);
  return response.items;
}
```

**Erreurs** :
- `401 Unauthorized` : Token invalide
- `500 Internal Server Error` : Erreur serveur

---

#### Create Quick Capture Item

**Endpoint** : `POST /api/mobile/quick-capture/items`

**Headers** :
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body** :
```json
{
  "title": "Remember to follow up with client",
  "dueDate": "2024-01-06T00:00:00Z" // Optionnel, ISO 8601
}
```

**Response** :
```json
{
  "id": "qc-2",
  "title": "Remember to follow up with client",
  "createdAt": "2024-01-01T12:00:00Z",
  "dueDate": "2024-01-06T00:00:00Z",
  "status": "inbox",
  "source": "mobile"
}
```

**Types** :
```typescript
export type CreateQuickCapturePayload = {
  title: string; // Obligatoire
  dueDate?: string | null; // Optionnel
};
```

**Code** :
```typescript
export async function createQuickCaptureItem(
  accessToken: string,
  payload: CreateQuickCapturePayload,
): Promise<QuickCaptureItem> {
  const path = '/mobile/quick-capture/items';
  return apiFetch<QuickCaptureItem>(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, accessToken);
}
```

**Erreurs** :
- `400 Bad Request` : Title manquant ou invalide
- `401 Unauthorized` : Token invalide
- `500 Internal Server Error` : Erreur serveur

---

#### Clear Quick Capture Inbox

**Endpoint** : `DELETE /api/mobile/quick-capture/items`

**Headers** :
```
Authorization: Bearer <access_token>
```

**Response** :
```json
{
  "success": true,
  "deletedCount": 5
}
```

**Code** :
```typescript
export async function clearQuickCaptureInbox(
  accessToken: string,
): Promise<void> {
  const path = '/mobile/quick-capture/items';
  await apiFetch<{ success: boolean; deletedCount?: number }>(
    path,
    {
      method: 'DELETE',
    },
    accessToken,
  );
}
```

**Erreurs** :
- `401 Unauthorized` : Token invalide
- `500 Internal Server Error` : Erreur serveur

---

**Notes d'implémentation** :
- Les items Quick Capture sont **SÉPARÉS** des Task (`/api/me/tasks`)
- Les items seront convertis en tâches Suivi complètes côté desktop (via une fonctionnalité à implémenter)
- Le statut `inbox` signifie que l'item est dans l'inbox mobile (non synchronisé)
- Le statut `sent` signifie que l'item a été envoyé au backend (pour plus tard)

---

## Architecture Mock/API-Ready

### Flag d'environnement

**Fichier** : `/src/config/environment.ts`

**Configuration** :
```typescript
export const USE_MOCK_API = true; // true = mocks, false = real API
```

**Utilisation** : Tous les fichiers API dans `/src/api/*.ts` vérifient ce flag pour utiliser soit les mocks (`src/mocks/data/*.ts`), soit les vraies API Suivi.

### Pattern Mock/Real API Switchable

Tous les fichiers API suivent le même pattern :

```typescript
import { USE_MOCK_API } from '../config/environment';
import * as mockData from '../mocks/data/tasks';

export async function getMyTasks(
  _accessToken?: string | null,
  params: { page?: number; pageSize?: number } = {},
): Promise<MyTasksPage> {
  if (USE_MOCK_API) {
    return mockData.getTasks(params);
  }

  // Future real Suivi API integration
  const path = `/me/tasks?${searchParams.toString()}`;
  if (!_accessToken) throw new Error('Access token required');
  return apiFetch<MyTasksPage>(path, {}, _accessToken);
}
```

**Migration vers la vraie API** :
1. Implémenter les fonctions API réelles dans `src/api/*.ts` (décommenter/ajouter le code après le `if (USE_MOCK_API)`)
2. Mettre `USE_MOCK_API = false` dans `/src/config/environment.ts`
3. Tester chaque endpoint individuellement

### Organisation des fichiers

**API Functions** : `/src/api/`
- `tasks.ts` : Fonctions API pour les tâches (mock + real)
- `activity.ts` : Fonctions API pour l'activité (mock + real)
- `notifications.ts` : Fonctions API pour les notifications (mock + real)
- `users.ts` : Fonctions API pour les utilisateurs (mock + real)

**Mock Data** : `/src/mocks/data/`
- `tasks.ts` : Données mockées pour les tâches
- `activity.ts` : Données mockées pour l'activité
- `notifications.ts` : Données mockées pour les notifications
- `users.ts` : Données mockées pour les utilisateurs

**React Query Hooks** : `/src/hooks/`
- `useTasks.ts` : Hooks React Query pour les tâches
- `useActivity.ts` : Hooks React Query pour l'activité
- `useNotifications.ts` : Hooks React Query pour les notifications
- `useUser.ts` : Hook React Query pour l'utilisateur

**Séparation** :
- UI (screens, components) → utilise uniquement les hooks
- Hooks → appellent les fonctions API
- API Functions → vérifient `USE_MOCK_API` et utilisent mocks ou real API
- Mock Data → stockage en mémoire simple (pas de persistance)

---

## Comment remplacer le mock par le backend réel

### 1. Configuration de l'URL de base

**Fichier** : `/src/api/client.ts`

**Actuel** :
```typescript
export const API_BASE_URL = 'https://api.suivi.local'; // TODO: replace with real backend URL
```

**Futur** :
```typescript
// Créer un fichier de configuration d'environnement
// /src/config/api.ts
export const API_BASE_URL = __DEV__
  ? 'https://api-dev.suivi.com' // Dev
  : 'https://api-staging.suivi.com'; // Staging (ou Production en production)
```

### 2. Utiliser le flag USE_MOCK_API

**Fichier** : `/src/config/environment.ts`

**Pour migrer vers la vraie API** :
```typescript
export const USE_MOCK_API = false; // Passer à false pour utiliser la vraie API
```

**Important** : Tous les fichiers API dans `/src/api/*.ts` vérifient automatiquement ce flag. Aucune modification supplémentaire n'est nécessaire dans les hooks ou les écrans.

### 2. Remplacer les fonctions mockées

#### AuthProvider.signIn()

**Actuel** :
```typescript
async function signIn(email: string, password: string): Promise<void> {
  const mockToken = `mock-token-${Date.now()}-${email}`;
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, mockToken);
  setAccessToken(mockToken);
}
```

**Futur** :
```typescript
async function signIn(email: string, password: string): Promise<void> {
  const response = await apiFetch<{ accessToken: string; refreshToken?: string }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  );
  
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.accessToken);
  if (response.refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refreshToken);
  }
  
  setAccessToken(response.accessToken);
}
```

### 3. Les fonctions API sont déjà prêtes

Les fonctions dans `/src/api/tasks.ts` (`getMyTasks`, `getTaskById`) utilisent déjà `apiFetch` qui appellera le backend réel quand `API_BASE_URL` sera configuré.

**Aucune modification nécessaire** dans :
- `/src/api/tasks.ts`
- `/src/hooks/useMyTasks.ts`
- Les écrans qui utilisent ces hooks

### 4. Gestion des erreurs HTTP

**Actuel** : `apiFetch` lance une `Error` générique si `response.ok === false`

**Futur** : Améliorer la gestion d'erreurs :

```typescript
// Dans /src/api/client.ts
export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  accessToken?: string | null,
): Promise<T> {
  // ... construction de l'URL et headers ...

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (!response.ok) {
    // Gérer spécifiquement les erreurs 401
    if (response.status === 401) {
      // Token expiré → essayer de rafraîchir ou déconnecter
      // (À implémenter)
    }

    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
```

### 5. Tests

Après avoir branché le backend réel :

1. **Tester la connexion** : Login avec des identifiants réels
2. **Tester les tâches** : Vérifier que la liste et les détails s'affichent correctement
3. **Tester les erreurs** : 401, 404, 500, etc.
4. **Tester la pagination** : Scroll infini dans MyTasksScreen

## Gestion des dates

**Format** : ISO 8601 (`2024-01-01T00:00:00Z`)

**Parsing** :
```typescript
const date = new Date(task.dueDate); // Parse automatique d'ISO 8601
```

**Affichage** :
```typescript
const formattedDate = date.toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
```

## Pagination

**Format standard** :
- Query params : `page`, `pageSize`
- Response : `{ items: T[], page: number, pageSize: number, total: number }`

**Pagination infinie (React Query)** :
```typescript
const query = useInfiniteQuery({
  queryKey: ['myTasks', filters],
  queryFn: ({ pageParam }) => getMyTasks(accessToken, { page: pageParam, pageSize: 20 }),
  getNextPageParam: (lastPage) => {
    const maxPage = Math.ceil(lastPage.total / lastPage.pageSize);
    if (lastPage.page >= maxPage) return undefined;
    return lastPage.page + 1;
  },
});
```

## Versioning de l'API

**À confirmer** : Si l'API utilise un versioning (ex: `/api/v1/...`)

Si oui, modifier `API_BASE_URL` :
```typescript
export const API_BASE_URL = 'https://api.suivi.com/api/v1';
```


