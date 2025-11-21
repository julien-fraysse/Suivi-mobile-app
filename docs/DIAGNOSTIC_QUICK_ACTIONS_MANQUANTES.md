# 🔍 Diagnostic : Quick Actions n'apparaissent pas dans TaskDetailScreen

**Date** : 2024-11-21  
**Problème** : Les Quick Actions n'apparaissent plus dans l'écran TaskDetailScreen sur Expo Web, alors qu'elles sont bien définies dans les mocks et que QuickActionPreview fonctionne.

---

## 📋 Résumé exécutif

**Cause probable** : **🟥 INCOMPATIBILITÉ ENTRE SOURCES DE MOCKS**

Les Quick Actions sont définies dans `src/mocks/suiviMock.ts` mais **TasksContext utilise `src/mocks/tasks/mockTasks.ts`** qui **ne contient PAS de quickAction**.

**Impact** : `task.quickAction` est toujours `undefined` car les tâches chargées par TasksContext n'ont pas cette propriété.

---

## 🔬 Section 1 : Diagnostic — QuickActionRenderer est-il monté ?

### Analyse de TaskDetailScreen.tsx (lignes 196-201)

```tsx
{/* Quick Action Renderer */}
{task && task.quickAction && (
  <View style={styles.quickActionSection}>
    <QuickActionRenderer task={task} onActionComplete={handleMockAction} />
  </View>
)}
```

**Résultat** : ✅ **QuickActionRenderer est bien présent dans le JSX**

- **Localisation** : Lignes 197-201
- **Position** : Entre le Status Selector (ligne 194) et Task Details Card (ligne 204)
- **Condition** : `task && task.quickAction && (...)` — condition valide
- **Props** : `task={task}` et `onActionComplete={handleMockAction}` — correctes

**Conclusion** : Le renderer est monté dans le JSX, mais la condition `task.quickAction` est probablement `undefined`.

---

## 🔬 Section 2 : Diagnostic — task.quickAction est-il undefined ?

### Analyse de la condition de rendu

**Condition à la ligne 197** : `{task && task.quickAction && (...)}`

**Problème identifié** : Si `task.quickAction` est `undefined`, le bloc entier ne se rend pas.

### Analyse de useTaskById

**Fichier** : `src/tasks/useTaskById.ts` (lignes 27-39)

```tsx
export function useTaskById(taskId: string) {
  const { getTaskById, isLoading, error } = useTasksContext();

  const task = useMemo(() => {
    return getTaskById(taskId);
  }, [getTaskById, taskId]);

  return { task, isLoading, error };
}
```

**Fonctionnement** :
1. Utilise `TasksContext` via `useTasksContext()`
2. Appelle `getTaskById(taskId)` pour récupérer la tâche
3. Retourne la tâche directement depuis le contexte

**Conclusion** : `useTaskById` retourne la tâche telle quelle depuis TasksContext, sans transformation.

---

## 🔬 Section 3 : Diagnostic — Conditions incorrectes ?

### Vérification des returns prématurés dans TaskDetailScreen

**Returns identifiés** :

1. **Ligne 113-124** : Loading state
   ```tsx
   if (isLoadingTask) {
     return (<Screen>...</Screen>);
   }
   ```
   ✅ **Pas de problème** — retourne uniquement pendant le chargement

2. **Ligne 128-142** : Error state
   ```tsx
   if (taskError || !task) {
     return (<Screen>...</Screen>);
   }
   ```
   ✅ **Pas de problème** — retourne uniquement en cas d'erreur ou si task est null

3. **Ligne 147** : Return principal
   ```tsx
   return (
     <Screen scrollable>
       ...
       {/* Quick Action Renderer à la ligne 197 */}
       ...
     </Screen>
   );
   ```
   ✅ **Pas de problème** — le renderer est bien dans le return principal

**Conclusion** : Aucun return prématuré n'empêche l'affichage du QuickActionRenderer.

---

## 🔬 Section 4 : Diagnostic — Problème dans useTask() ?

### Analyse de TasksContext

**Fichier** : `src/tasks/TasksContext.tsx`

**Chargement des tâches** (lignes 74-92) :
```tsx
const loadTasks = useCallback(async () => {
  try {
    setIsLoading(true);
    setError(null);
    const mockTasks = await loadMockTasks();  // ← Charge depuis mockTaskHelpers
    setTasks(mockTasks);
  } catch (err) {
    // Error handling...
  } finally {
    setIsLoading(false);
  }
}, []);
```

**Fonction `getTaskById`** (lignes 104-109) :
```tsx
const getTaskById = useCallback(
  (id: string): Task | undefined => {
    return tasks.find((task) => task.id === id);
  },
  [tasks]
);
```

**Problème identifié** : `loadTasks()` appelle `loadMockTasks()` qui charge depuis `src/mocks/tasks/mockTasks.ts`.

### Analyse de mockTaskHelpers.ts

**Fichier** : `src/mocks/tasks/mockTaskHelpers.ts` (lignes 25-29)

```tsx
export async function loadMockTasks(): Promise<Task[]> {
  await delay(300);
  return [...MOCK_TASKS];  // ← Importe depuis mockTasks.ts
}
```

**Source des données** : Importe `MOCK_TASKS` depuis `./mockTasks`.

### Analyse de mockTasks.ts

**Fichier** : `src/mocks/tasks/mockTasks.ts`

**Résultat critique** : ❌ **AUCUNE TÂCHE N'A DE `quickAction`**

- Les tâches ont des IDs : `'task-1'`, `'task-2'`, `'task-3'`, etc.
- Aucune propriété `quickAction` n'est définie dans les 16 tâches mockées (lignes 40-258)

**Conclusion** : Les tâches chargées par TasksContext n'ont PAS de `quickAction`, donc `task.quickAction` est toujours `undefined`.

---

## 🔬 Section 5 : Diagnostic — Return prématuré ?

**Résultat** : ✅ **Aucun return prématuré détecté**

Voir Section 3 pour les détails.

---

## 🔬 Section 6 : Diagnostic — Erreur silencieuse dans un composant enfant ?

### Analyse de QuickActionRenderer

**Fichier** : `src/components/tasks/quickactions/QuickActionRenderer.tsx`

**Structure** :
```tsx
export function QuickActionRenderer({ task, onActionComplete }: QuickActionRendererProps) {
  if (!task.quickAction) {
    return null;  // ← Retourne null si quickAction est undefined
  }

  const { uiHint, payload } = task.quickAction;

  switch (uiHint) {
    case "comment_input":
      return <QuickActionComment ... />;
    // ... autres cases
    default:
      return null;
  }
}
```

**Résultat** : ✅ **Aucune erreur silencieuse**

- Si `task.quickAction` est `undefined`, le renderer retourne `null` (comportement attendu)
- Si `task.quickAction` existe, le switch mappe correctement vers les composants
- Tous les `uiHint` sauf `"progress_slider"` mappent vers un composant JSX valide

**Conclusion** : Le problème n'est pas dans QuickActionRenderer, mais dans l'absence de `task.quickAction`.

---

## 🔬 Section 7 : Diagnostic — Incompatibilité des sources de mocks

### Problème identifié

**Il existe DEUX sources de mocks différentes** :

1. **`src/mocks/suiviMock.ts`** (utilisé par QuickActionPreview ?)
   - Contient 8 tâches avec IDs : `'1'`, `'2'`, `'3'`, `'4'`, `'5'`, `'6'`, `'7'`, `'8'`
   - ✅ **TOUTES les tâches ont une propriété `quickAction`**
   - Exemple (lignes 76-79) :
     ```tsx
     quickAction: {
       actionType: "COMMENT",
       uiHint: "comment_input",
     },
     ```

2. **`src/mocks/tasks/mockTasks.ts`** (utilisé par TasksContext)
   - Contient 16 tâches avec IDs : `'task-1'`, `'task-2'`, `'task-3'`, etc.
   - ❌ **AUCUNE tâche n'a de propriété `quickAction`**
   - Les tâches sont complètes (description, status, dates, etc.) mais sans quickAction

### Chemin de données dans TaskDetailScreen

```
TaskDetailScreen (taskId)
  ↓
useTaskById(taskId) (ligne 49)
  ↓
TasksContext.getTaskById(taskId) (ligne 104-109)
  ↓
tasks.find(task => task.id === taskId) (ligne 106)
  ↓
tasks vient de loadMockTasks() (ligne 81)
  ↓
mockTaskHelpers.loadMockTasks() (ligne 25-29)
  ↓
MOCK_TASKS depuis mockTasks.ts (ligne 28)
  ↓
❌ PROBLÈME : mockTasks.ts n'a PAS de quickAction
```

### Pourquoi QuickActionPreview fonctionne ?

**Hypothèse** : QuickActionPreview est utilisé dans `TaskItem.tsx` qui utilise probablement une autre source de données (peut-être `suiviMock.ts` ou une autre API).

**Vérification nécessaire** : Vérifier d'où vient `task.quickAction` dans `TaskItem.tsx`.

---

## 🎯 Section 8 : Résultat synthèse — Cause probable + Lignes exactes

### Cause probable : INCOMPATIBILITÉ ENTRE SOURCES DE MOCKS

**Problème principal** : Les Quick Actions sont définies dans `src/mocks/suiviMock.ts` mais **TasksContext charge les tâches depuis `src/mocks/tasks/mockTasks.ts`** qui n'a pas de `quickAction`.

### Lignes exactes du problème

1. **TaskDetailScreen.tsx** — Condition qui ne passe jamais (ligne 197)
   ```tsx
   {task && task.quickAction && (  // ← task.quickAction est toujours undefined
     <View style={styles.quickActionSection}>
       <QuickActionRenderer task={task} onActionComplete={handleMockAction} />
     </View>
   )}
   ```

2. **TasksContext.tsx** — Chargement depuis la mauvaise source (ligne 81)
   ```tsx
   const mockTasks = await loadMockTasks();  // ← Charge depuis mockTasks.ts (sans quickAction)
   setTasks(mockTasks);
   ```

3. **mockTaskHelpers.ts** — Import de la mauvaise source (ligne 11, 28)
   ```tsx
   import { MOCK_TASKS } from './mockTasks';  // ← mockTasks.ts n'a pas de quickAction
   
   export async function loadMockTasks(): Promise<Task[]> {
     return [...MOCK_TASKS];  // ← Retourne des tâches sans quickAction
   }
   ```

4. **mockTasks.ts** — Source de données sans quickAction (lignes 40-258)
   - Aucune des 16 tâches n'a de propriété `quickAction`
   - Toutes les tâches ont des IDs différents (`'task-1'`, `'task-2'`, etc.)

5. **suiviMock.ts** — Source de données avec quickAction (lignes 67-176)
   - 8 tâches avec IDs : `'1'`, `'2'`, `'3'`, `'4'`, `'5'`, `'6'`, `'7'`, `'8'`
   - Toutes les tâches ont une propriété `quickAction` complète

### Solution recommandée

**Option 1** : Ajouter les `quickAction` dans `mockTasks.ts`
- Avantage : Solution simple et rapide
- Inconvénient : Duplication de données entre les deux sources de mocks

**Option 2** : Unifier les sources de mocks
- Utiliser `suiviMock.ts` comme source unique
- Mettre à jour `mockTaskHelpers.ts` pour importer depuis `suiviMock.ts`
- Avantage : Source unique de vérité
- Inconvénient : Nécessite de vérifier que toutes les propriétés de `mockTasks.ts` sont présentes dans `suiviMock.ts`

**Option 3** : Merger les deux sources
- Fusionner les données de `mockTasks.ts` et `suiviMock.ts`
- Avantage : Toutes les tâches ont toutes les propriétés
- Inconvénient : Plus complexe, nécessite de gérer les conflits d'IDs

---

## ✅ Checklist de vérification

- [x] QuickActionRenderer est présent dans TaskDetailScreen (ligne 197-201)
- [x] Condition de rendu est correcte (`task && task.quickAction`)
- [x] Aucun return prématuré n'empêche le rendu
- [x] QuickActionRenderer fonctionne correctement (pas d'erreur silencieuse)
- [x] TasksContext charge les tâches depuis `mockTasks.ts`
- [x] `mockTasks.ts` n'a PAS de propriété `quickAction`
- [x] `suiviMock.ts` a bien les `quickAction` mais n'est PAS utilisé par TasksContext
- [x] Incompatibilité entre sources de mocks identifiée

---

## 📝 Notes supplémentaires

1. **QuickActionPreview fonctionne** : Probablement car il utilise une autre source de données (à vérifier dans `TaskItem.tsx`).

2. **IDs incompatibles** : Les IDs dans `suiviMock.ts` (`'1'`, `'2'`, etc.) sont différents de ceux dans `mockTasks.ts` (`'task-1'`, `'task-2'`, etc.).

3. **Pas d'erreur visible** : Le code fonctionne correctement, il n'y a juste pas de `quickAction` dans les tâches chargées par TasksContext.

---

## 🎯 Conclusion

**Cause probable** : ✅ **INCOMPATIBILITÉ ENTRE SOURCES DE MOCKS**

Les Quick Actions sont définies dans `suiviMock.ts` mais TasksContext charge les tâches depuis `mockTasks.ts` qui n'a pas de `quickAction`. Résultat : `task.quickAction` est toujours `undefined`, donc le bloc QuickActionRenderer ne se rend jamais.

**Lignes exactes à corriger** :
- `src/mocks/tasks/mockTasks.ts` : Ajouter les `quickAction` aux tâches
- OU unifier les sources de mocks pour utiliser `suiviMock.ts`

---

**Rapport généré le** : 2024-11-21  
**Aucune modification effectuée** (conforme aux instructions)

