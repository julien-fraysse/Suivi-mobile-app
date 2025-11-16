# Tasks API Contract - Suivi Mobile App

Ce document définit le contrat d'API attendu pour l'intégration de l'API Suivi backend avec le système de gestion des tâches mobile.

---

## Base URL

```
https://api.suivi.app
```

---

## Authentification

Tous les endpoints nécessitent un **token JWT** dans le header `Authorization` :

```
Authorization: Bearer <access_token>
```

---

## Types de données

### TaskStatus

Type union représentant les statuts possibles d'une tâche.

```typescript
type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
```

**Valeurs** :
- `'todo'` : Tâche à faire
- `'in_progress'` : Tâche en cours
- `'blocked'` : Tâche bloquée
- `'done'` : Tâche terminée

### Task

Interface représentant une tâche dans le système Suivi.

```typescript
interface Task {
  id: string;                    // Identifiant unique (UUID ou string)
  title: string;                 // Titre de la tâche (obligatoire)
  description?: string;          // Description détaillée (optionnel)
  status: TaskStatus;            // Statut actuel (obligatoire)
  dueDate?: string;              // Date d'échéance (format: YYYY-MM-DD, optionnel)
  projectId?: string;            // ID du projet associé (optionnel)
  projectName?: string;          // Nom du projet (optionnel, pour affichage)
  assigneeName?: string;         // Nom de l'assigné (optionnel)
  assigneeInitials?: string;     // Initiales de l'assigné (optionnel)
  createdAt: string;             // Date de création (format: ISO 8601, obligatoire)
  updatedAt: string;             // Date de dernière mise à jour (format: ISO 8601, obligatoire)
}
```

**Champs obligatoires** :
- `id`
- `title`
- `status`
- `createdAt`
- `updatedAt`

**Champs optionnels** :
- `description`
- `dueDate`
- `projectId`
- `projectName`
- `assigneeName`
- `assigneeInitials`

---

## Endpoints

### 1. Lister les tâches

**GET** `/api/tasks`

Récupère la liste complète des tâches de l'utilisateur authentifié.

**Headers** :
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response** :
```json
{
  "tasks": [
    {
      "id": "task-1",
      "title": "Implémenter le design system Suivi",
      "description": "Créer un design system complet...",
      "status": "in_progress",
      "dueDate": "2024-11-20",
      "projectId": "project-mobile-app",
      "projectName": "Mobile App",
      "assigneeName": "Julien",
      "assigneeInitials": "JF",
      "createdAt": "2024-11-15T10:00:00.000Z",
      "updatedAt": "2024-11-16T10:00:00.000Z"
    },
    // ... autres tâches
  ]
}
```

**Status Codes** :
- `200 OK` : Succès
- `401 Unauthorized` : Token invalide ou expiré
- `500 Internal Server Error` : Erreur serveur

---

### 2. Récupérer une tâche par ID

**GET** `/api/tasks/:id`

Récupère une tâche spécifique par son identifiant.

**Headers** :
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters** :
- `id` (string) : ID de la tâche à récupérer

**Response** :
```json
{
  "id": "task-1",
  "title": "Implémenter le design system Suivi",
  "description": "Créer un design system complet...",
  "status": "in_progress",
  "dueDate": "2024-11-20",
  "projectId": "project-mobile-app",
  "projectName": "Mobile App",
  "assigneeName": "Julien",
  "assigneeInitials": "JF",
  "createdAt": "2024-11-15T10:00:00.000Z",
  "updatedAt": "2024-11-16T10:00:00.000Z"
}
```

**Status Codes** :
- `200 OK` : Succès
- `404 Not Found` : Tâche introuvable
- `401 Unauthorized` : Token invalide ou expiré
- `500 Internal Server Error` : Erreur serveur

---

### 3. Mettre à jour le statut d'une tâche

**PATCH** `/api/tasks/:id/status`

Met à jour le statut d'une tâche.

**Headers** :
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters** :
- `id` (string) : ID de la tâche à mettre à jour

**Request Body** :
```json
{
  "status": "done"
}
```

**Response** :
```json
{
  "id": "task-1",
  "title": "Implémenter le design system Suivi",
  "description": "Créer un design system complet...",
  "status": "done",
  "dueDate": "2024-11-20",
  "projectId": "project-mobile-app",
  "projectName": "Mobile App",
  "assigneeName": "Julien",
  "assigneeInitials": "JF",
  "createdAt": "2024-11-15T10:00:00.000Z",
  "updatedAt": "2024-11-16T15:30:00.000Z"
}
```

**Status Codes** :
- `200 OK` : Succès
- `400 Bad Request` : Statut invalide
- `404 Not Found` : Tâche introuvable
- `401 Unauthorized` : Token invalide ou expiré
- `403 Forbidden` : L'utilisateur n'a pas le droit de modifier cette tâche
- `500 Internal Server Error` : Erreur serveur

**Validation** :
- `status` doit être l'une des valeurs : `'todo'`, `'in_progress'`, `'blocked'`, `'done'`
- La tâche doit exister
- L'utilisateur doit avoir le droit de modifier la tâche

---

## Format des dates

### dueDate

Format : `YYYY-MM-DD` (ISO 8601 date only)

Exemples :
- `"2024-11-20"` : 20 novembre 2024
- `"2024-12-31"` : 31 décembre 2024

### createdAt / updatedAt

Format : `YYYY-MM-DDTHH:mm:ss.sssZ` (ISO 8601 full datetime)

Exemples :
- `"2024-11-15T10:00:00.000Z"` : 15 novembre 2024, 10h00 UTC
- `"2024-11-16T15:30:00.000Z"` : 16 novembre 2024, 15h30 UTC

---

## Gestion des erreurs

### Format d'erreur standard

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Message d'erreur lisible par l'humain",
    "details": {
      // Détails supplémentaires (optionnel)
    }
  }
}
```

### Codes d'erreur courants

- `INVALID_TOKEN` : Token d'authentification invalide ou expiré
- `TASK_NOT_FOUND` : Tâche introuvable
- `INVALID_STATUS` : Statut invalide
- `FORBIDDEN` : L'utilisateur n'a pas le droit d'effectuer cette action
- `SERVER_ERROR` : Erreur serveur interne

---

## Exemples d'utilisation

### Exemple 1 : Charger toutes les tâches

```typescript
const response = await fetch('https://api.suivi.app/api/tasks', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
const tasks: Task[] = data.tasks;
```

### Exemple 2 : Récupérer une tâche spécifique

```typescript
const taskId = 'task-1';
const response = await fetch(`https://api.suivi.app/api/tasks/${taskId}`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});

const task: Task = await response.json();
```

### Exemple 3 : Mettre à jour le statut d'une tâche

```typescript
const taskId = 'task-1';
const newStatus: TaskStatus = 'done';

const response = await fetch(`https://api.suivi.app/api/tasks/${taskId}/status`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ status: newStatus }),
});

const updatedTask: Task = await response.json();
```

---

## Notes importantes

1. **Pagination** : Pour le MVP, l'API retourne toutes les tâches. Si le nombre de tâches devient important, ajouter la pagination avec `?page=1&limit=50`.

2. **Filtres** : Pour le MVP, les filtres (active, completed) sont gérés côté client. Plus tard, on pourra ajouter des paramètres de requête comme `?status=active`.

3. **Permissions** : L'utilisateur ne peut modifier que ses propres tâches (ou celles qui lui sont assignées).

4. **Rate limiting** : L'API peut limiter le nombre de requêtes par minute. Gérer les erreurs `429 Too Many Requests` avec un retry.

5. **Cache** : Le mobile met en cache les tâches localement. Le backend peut utiliser les headers HTTP `ETag` ou `Last-Modified` pour optimiser les requêtes.

---

## Migration depuis les mocks

Pour migrer depuis les mocks vers l'API Suivi, voir `docs/mobile/tasks-architecture.md` section "Comment connecter l'API Suivi".


