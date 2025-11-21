# Quick Actions MVP - Documentation

## Vue d'ensemble

Le système de Quick Actions permet d'ajouter des actions rapides directement dans les tâches de l'application mobile Suivi. Ces actions sont définies par le backend Suivi via le champ `quickAction` sur chaque tâche.

## Structure Quick Action

### Type Task étendu

```typescript
export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  // ... autres champs
  quickAction?: {
    actionType:
      | "COMMENT"
      | "APPROVAL"
      | "RATING"
      | "PROGRESS"
      | "WEATHER"
      | "CALENDAR"
      | "CHECKBOX"
      | "SELECT";
    uiHint: string;
    payload?: Record<string, any>;
  };
};
```

### Champs

- **actionType** : Type d'action (8 types supportés)
- **uiHint** : Indicateur de l'UI à afficher
- **payload** : Données optionnelles pour configurer l'action (ex: options de sélection, min/max pour slider, etc.)

## Liste des UI Hints

| actionType | uiHint | Description | payload |
|------------|--------|-------------|---------|
| COMMENT | `comment_input` | Zone de texte pour commentaire | - |
| APPROVAL | `approval_dual_button` | Deux boutons Approuver/Refuser | `{ requestId?: string }` |
| RATING | `stars_1_to_5` | 5 étoiles pour notation | - |
| PROGRESS | `progress_slider` | Slider de progression 0-100 | `{ min?: number, max?: number }` |
| WEATHER | `weather_picker` | Sélecteur de météo | `{ options?: string[] }` |
| CALENDAR | `calendar_picker` | Sélecteur de date | - |
| CHECKBOX | `simple_checkbox` | Case à cocher simple | - |
| SELECT | `dropdown_select` | Liste déroulante | `{ options?: string[] }` |

## Architecture

### Schéma de flux

```
Task (avec quickAction)
  ↓
TaskDetailScreen
  ↓
QuickActionRenderer
  ↓ (switch sur uiHint)
  ├── QuickActionComment (uiHint: "comment_input")
  ├── QuickActionApproval (uiHint: "approval_dual_button")
  ├── QuickActionRating (uiHint: "stars_1_to_5")
  ├── QuickActionProgress (uiHint: "progress_slider")
  ├── QuickActionWeather (uiHint: "weather_picker")
  ├── QuickActionCalendar (uiHint: "calendar_picker")
  ├── QuickActionCheckbox (uiHint: "simple_checkbox")
  └── QuickActionSelect (uiHint: "dropdown_select")
  ↓
onActionComplete({ actionType, details })
  ↓
handleMockAction (TaskDetailScreen)
  ↓
Création d'une entrée SuiviActivityEvent locale
  ↓
Affichage dans l'historique d'activité
```

### Composants

#### QuickActionRenderer
**Fichier** : `src/components/tasks/quickactions/QuickActionRenderer.tsx`

Rôle : Router conditionnel qui affiche le bon composant selon `task.quickAction.uiHint`.

**Props** :
```typescript
interface QuickActionRendererProps {
  task: Task;
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}
```

#### Composants Quick Actions

Tous les composants suivent la même interface :

**Props** :
```typescript
interface QuickActionXProps {
  task: Task;
  payload?: Record<string, any>; // Optionnel selon le type
  onActionComplete: (result: { actionType: string; details: Record<string, any> }) => void;
}
```

**Composants disponibles** :
1. `QuickActionComment.tsx` - Input texte multiligne
2. `QuickActionApproval.tsx` - Deux boutons Approuver/Refuser
3. `QuickActionRating.tsx` - 5 étoiles cliquables
4. `QuickActionProgress.tsx` - Slider de progression
5. `QuickActionWeather.tsx` - Sélecteur de météo
6. `QuickActionCalendar.tsx` - Sélecteur de date
7. `QuickActionCheckbox.tsx` - Case à cocher
8. `QuickActionSelect.tsx` - Dropdown avec options

#### QuickActionPreview
**Fichier** : `src/components/tasks/QuickActionPreview.tsx`

Rôle : Affiche une icône discrète dans la liste des tâches (`TaskItem`) pour indiquer qu'une Quick Action est disponible.

**Icônes** :
- COMMENT → `message-text`
- APPROVAL → `check-circle`
- RATING → `star`
- PROGRESS → `speedometer`
- WEATHER → `weather-cloudy`
- CALENDAR → `calendar`
- CHECKBOX → `checkbox-marked`
- SELECT → `menu-down`

## Mock Actions

### Implémentation actuelle

Les Quick Actions sont **mockées** pour le MVP. Quand une action est complétée :

1. `onActionComplete` est appelé avec `{ actionType, details }`
2. `handleMockAction` dans `TaskDetailScreen` crée une entrée locale `SuiviActivityEvent`
3. L'entrée est ajoutée à `localActivities` (state local)
4. L'historique affiche les activités API + locales, triées par date DESC

### Structure d'une activité locale

```typescript
const activityEntry: SuiviActivityEvent = {
  id: `local-${Date.now()}`,
  source: 'BOARD',
  eventType: getEventTypeFromActionType(result.actionType),
  title: getActivityTitle(result.actionType, result.details),
  workspaceName: task.workspaceName || 'Default',
  boardName: task.boardName,
  actor: {
    name: `${user.firstName} ${user.lastName}`,
    avatarUrl: user.avatarUrl,
    userId: user.id,
  },
  createdAt: new Date().toISOString(),
  severity: 'INFO',
  taskInfo: {
    taskId: task.id,
    taskTitle: task.title,
  },
};
```

### Mapping actionType → eventType

- `COMMENT` → `TASK_CREATED`
- `APPROVAL` → `TASK_COMPLETED`
- Autres → `TASK_REPLANNED`

### Titres d'activité générés

- COMMENT : `"Commentaire ajouté : [comment]"`
- APPROVAL : `"Demande approuvée"` ou `"Demande refusée"`
- RATING : `"Note de [rating] étoiles"`
- PROGRESS : `"Progression mise à jour : [progress]%"`
- WEATHER : `"Météo définie : [weather]"`
- CALENDAR : `"Date définie : [date]"`
- CHECKBOX : `"Étape cochée"` ou `"Étape décochée"`
- SELECT : `"Option sélectionnée : [selectedOption]"`

## Intégration Backend Suivi

### Migration future

Quand le backend Suivi sera prêt, voici comment s'y brancher :

#### 1. Endpoint API

**POST** `/api/v1/tasks/:taskId/quick-actions/complete`

**Body** :
```json
{
  "actionType": "COMMENT",
  "details": {
    "comment": "Texte du commentaire"
  }
}
```

**Réponse** :
```json
{
  "success": true,
  "activityId": "act-123",
  "activity": {
    // SuiviActivityEvent complet
  }
}
```

#### 2. Modifications nécessaires

Dans `TaskDetailScreen.tsx`, remplacer `handleMockAction` par :

```typescript
async function handleActionComplete(result: { actionType: string; details: Record<string, any> }) {
  try {
    const response = await apiFetch<{ activity: SuiviActivityEvent }>(
      `/tasks/${taskId}/quick-actions/complete`,
      {
        method: 'POST',
        body: JSON.stringify(result),
      },
      accessToken
    );
    
    // Option 1: Ajouter à l'historique local
    setLocalActivities((prev) => [response.activity, ...prev]);
    
    // Option 2: Invalider le cache React Query pour recharger
    queryClient.invalidateQueries(['activity', 'task', taskId]);
  } catch (error) {
    console.error('Error completing quick action:', error);
    // Afficher une notification d'erreur
  }
}
```

#### 3. Gestion d'erreur

- Afficher un message d'erreur à l'utilisateur si l'appel échoue
- Optionnel : Rollback de l'UI si nécessaire
- Logger l'erreur pour debugging

#### 4. Optimistic Updates

Pour une meilleure UX, on peut mettre à jour l'UI immédiatement (optimistic update) puis synchroniser avec le backend :

```typescript
async function handleActionComplete(result) {
  // 1. Mise à jour optimiste (immédiate)
  const optimisticActivity = createOptimisticActivity(result);
  setLocalActivities((prev) => [optimisticActivity, ...prev]);
  
  try {
    // 2. Appel API
    const response = await apiFetch(...);
    
    // 3. Remplacer l'optimiste par la vraie réponse
    setLocalActivities((prev) => 
      prev.map(act => act.id === optimisticActivity.id ? response.activity : act)
    );
  } catch (error) {
    // 4. Rollback en cas d'erreur
    setLocalActivities((prev) => 
      prev.filter(act => act.id !== optimisticActivity.id)
    );
    // Afficher erreur
  }
}
```

## Fichiers modifiés

### Types
- `src/api/tasks.ts` - Ajout du champ `quickAction` au type `Task`

### Mocks
- `src/mocks/suiviMock.ts` - 8 tâches avec quickAction différentes

### Composants UI
- `src/components/ui/TaskItem.tsx` - Ajout de `QuickActionPreview`
- `src/components/tasks/QuickActionPreview.tsx` - Icône de prévisualisation
- `src/components/tasks/quickactions/QuickActionRenderer.tsx` - Router conditionnel
- `src/components/tasks/quickactions/QuickActionComment.tsx` - Action commentaire
- `src/components/tasks/quickactions/QuickActionApproval.tsx` - Action approbation
- `src/components/tasks/quickactions/QuickActionRating.tsx` - Action notation
- `src/components/tasks/quickactions/QuickActionProgress.tsx` - Action progression
- `src/components/tasks/quickactions/QuickActionWeather.tsx` - Action météo
- `src/components/tasks/quickactions/QuickActionCalendar.tsx` - Action calendrier
- `src/components/tasks/quickactions/QuickActionCheckbox.tsx` - Action checkbox
- `src/components/tasks/quickactions/QuickActionSelect.tsx` - Action sélection

### Écrans
- `src/screens/TaskDetailScreen.tsx` - Intégration de `QuickActionRenderer` et `handleMockAction`

## Tests

### Tests visuels requis

1. **Liste des tâches** (`MyTasksScreen`)
   - ✅ Vérifier que l'icône `QuickActionPreview` apparaît sur les tâches avec quickAction
   - ✅ Vérifier que le layout n'a pas changé (pas de régression)

2. **Détails d'une tâche** (`TaskDetailScreen`)
   - ✅ Vérifier que `QuickActionRenderer` apparaît avant la carte de détails
   - ✅ Vérifier que chaque type d'action s'affiche correctement
   - ✅ Vérifier que l'action complétée apparaît dans l'historique
   - ✅ Vérifier que le layout n'a pas changé (sauf zone Quick Actions)

3. **Historique d'activité**
   - ✅ Vérifier que les activités locales apparaissent immédiatement
   - ✅ Vérifier que les activités locales + API sont triées par date DESC
   - ✅ Vérifier le format d'affichage des activités

## Limitations MVP

1. **Actions mockées uniquement** : Pas d'appel API réel
2. **Pas de persistance** : Les activités locales sont perdues au refresh
3. **Pas de validation** : Les données ne sont pas validées côté backend
4. **Pas d'authentification** : Les actions mockées ne vérifient pas les permissions

## Prochaines étapes

1. Implémenter l'endpoint API `/api/v1/tasks/:taskId/quick-actions/complete`
2. Remplacer `handleMockAction` par un appel API réel
3. Ajouter la persistance des activités (cache local ou backend)
4. Ajouter la validation des données côté backend
5. Ajouter la gestion des permissions (qui peut exécuter quelle action)
6. Ajouter des tests unitaires pour les composants Quick Actions
7. Ajouter des tests d'intégration pour le flux complet

