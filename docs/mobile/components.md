# Components Documentation

## Vue d'ensemble

Cette documentation décrit tous les composants UI Suivi réutilisables, leur API, leur design, et leur utilisation.

**RÈGLE ABSOLUE** : Tous les composants utilisent EXCLUSIVEMENT les tokens Suivi. Aucune valeur hardcodée (couleurs, spacing, radius, typography).

---

## StatCard

**Fichier** : `src/components/ui/StatCard.tsx`

**Description** : Carte de statistique pour Quick Actions sur HomeScreen.

### API

```typescript
interface StatCardProps {
  title: string;           // Titre de la statistique
  value: string | number;  // Valeur à afficher
  color?: 'primary' | 'accent' | 'success' | 'error'; // Couleur de fond (default: 'primary')
  onPress?: () => void;    // Handler pour le tap (optionnel)
  style?: ViewStyle;       // Style personnalisé (optionnel)
}
```

### Design

- **Fond** : Couleur selon `color` prop
  - `primary` : `tokens.colors.brand.primary` (#4F5DFF)
  - `accent` : `tokens.colors.accent.maize` (#FDD447)
  - `success` : `tokens.colors.semantic.success` (#00C853)
  - `error` : `tokens.colors.semantic.error` (#D32F2F)
- **Texte** : Inverse (blanc) pour valeur et titre
- **Typography** :
  - Valeur : `SuiviText variant="h2" color="inverse"`
  - Titre : `SuiviText variant="body" color="inverse"` (opacity 0.9)
- **Radius** : `tokens.radius.xl` (20px)
- **Padding** : `tokens.spacing.lg` (16px)
- **Shadow** : `tokens.shadows.card`
- **Min Height** : 100px

### Utilisation

```tsx
<StatCard
  title="Active Tasks"
  value={12}
  color="primary"
  onPress={() => navigation.navigate('MyTasks')}
/>
```

### Utilisé dans

- `HomeScreen` : Quick Actions (Active Tasks, Due Today)

### Tokens utilisés

- `tokens.colors.brand.primary`, `tokens.colors.brand.primaryDark`
- `tokens.colors.accent.maize`
- `tokens.colors.semantic.success`, `tokens.colors.semantic.error`
- `tokens.colors.text.onPrimary` (via `color="inverse"`)
- `tokens.radius.xl`
- `tokens.spacing.lg`, `tokens.spacing.xs`
- `tokens.shadows.card`

---

## TaskItem

**Fichier** : `src/components/ui/TaskItem.tsx`

**Description** : Composant pour afficher un item de tâche dans la liste.

### API

```typescript
interface TaskItemProps {
  task: Task;              // Tâche à afficher
  onPress?: () => void;    // Handler pour le tap (optionnel)
  style?: ViewStyle;       // Style personnalisé (optionnel)
}
```

### Design

- **Card** : `SuiviCard` avec `elevation="card"`, `variant="default"`
- **Header** : Titre (h2) et status pill (coloré selon statut)
- **Typography** :
  - Titre : `SuiviText variant="h2"`
  - Status : `SuiviText variant="caption" color="inverse"`
  - Project : `SuiviText variant="body2" color="secondary"`
  - Due date : `SuiviText variant="body2" color="secondary"`
- **Status colors** :
  - `todo` : `tokens.colors.brand.primary` (#4F5DFF)
  - `in_progress` : `tokens.colors.accent.maize` (#FDD447)
  - `blocked` : `tokens.colors.semantic.error` (#D32F2F)
  - `done` : `tokens.colors.semantic.success` (#00C853)
- **Padding** : `tokens.spacing.md` (12px)
- **Radius** : `tokens.radius.lg` (16px)

### Utilisation

```tsx
<TaskItem
  task={task}
  onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
/>
```

### Utilisé dans

- `MyTasksScreen` : Liste des tâches (`renderTaskItem`)

### Tokens utilisés

- `tokens.colors.brand.primary`, `tokens.colors.accent.maize`
- `tokens.colors.semantic.error`, `tokens.colors.semantic.success`
- `tokens.colors.neutral.medium` (fallback)
- `tokens.colors.text.primary`, `tokens.colors.text.secondary`
- `tokens.colors.text.onPrimary` (via `color="inverse"`)
- `tokens.radius.lg`, `tokens.radius.sm`
- `tokens.spacing.md`, `tokens.spacing.sm`, `tokens.spacing.xs`
- `tokens.shadows.card`

---

## NotificationItem

**Fichier** : `src/components/ui/NotificationItem.tsx`

**Description** : Composant pour afficher un item de notification dans la liste.

### API

```typescript
interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'task_overdue' | 'project_update' | 'comment';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationItemProps {
  notification: Notification; // Notification à afficher
  onPress?: () => void;       // Handler pour le tap (optionnel)
  style?: ViewStyle;          // Style personnalisé (optionnel)
}
```

### Design

- **Card** : `SuiviCard` avec variant et elevation selon l'état
  - Non lue : `elevation="card"`, `variant="default"`
  - Lue : `elevation="sm"`, `variant="outlined"`
- **Indicateurs visuels** :
  - Non lue : Bordure gauche bleue (4px) + badge point bleu (8px)
  - Lue : Variant outlined, pas de badge
- **Typography** :
  - Titre : `SuiviText variant="h2"`
  - Message : `SuiviText variant="body" color="secondary"`
  - Date : `SuiviText variant="caption" color="secondary"`
- **Padding** : `tokens.spacing.md` (12px)
- **Radius** : `tokens.radius.lg` (16px)

### Utilisation

```tsx
<NotificationItem
  notification={notification}
  onPress={() => handleMarkAsRead(notification.id)}
/>
```

### Utilisé dans

- `NotificationsScreen` : Liste des notifications (`renderNotificationItem`)

### Tokens utilisés

- `tokens.colors.brand.primary` (bordure et badge non lue)
- `tokens.colors.text.primary`, `tokens.colors.text.secondary`
- `tokens.colors.border.default`
- `tokens.radius.lg`
- `tokens.spacing.md`, `tokens.spacing.sm`, `tokens.spacing.xs`
- `tokens.shadows.card`, `tokens.shadows.sm`

---

## UserAvatar

**Fichier** : `src/components/ui/UserAvatar.tsx`

**Description** : Avatar utilisateur avec initiales fallback.

### API

```typescript
interface UserAvatarProps {
  firstName: string;        // Prénom de l'utilisateur
  lastName: string;         // Nom de l'utilisateur
  avatarUrl?: string;       // URL de l'image (optionnel)
  size?: 'sm' | 'md' | 'lg'; // Taille de l'avatar (default: 'md')
  style?: ViewStyle;        // Style personnalisé (optionnel)
}
```

### Design

- **Fond** : `tokens.colors.brand.primary` (#4F5DFF)
- **Texte** : Blanc (inverse) avec initiales
- **Shape** : Circulaire (`borderRadius: size / 2`)
- **Sizes** :
  - `sm` : 32px (fontSize: 15)
  - `md` : 48px (fontSize: 16)
  - `lg` : 64px (fontSize: 18)
- **Typography** : Initiales avec `SuiviText variant="h2" color="inverse"`, fontWeight: '700'
- **Fallback** : Affiche les initiales si `avatarUrl` n'est pas fourni

### Utilisation

```tsx
<UserAvatar
  firstName="Julien"
  lastName="Suivi"
  avatarUrl={user.avatarUrl}
  size="lg"
/>
```

### Utilisé dans

- `MoreScreen` : Profil utilisateur (size="lg")
- `TaskDetailScreen` : Avatar assigné (si nécessaire)

### Tokens utilisés

- `tokens.colors.brand.primary`
- `tokens.colors.text.onPrimary` (via `color="inverse"`)
- `tokens.typography.h2.fontSize`, `tokens.typography.h6.fontSize`, `tokens.typography.body.fontSize`
- `tokens.spacing.md` (margin pour layout)

---

## Architecture des composants

### Structure commune

Tous les composants suivent cette structure :

```typescript
export interface ComponentProps {
  // Props spécifiques au composant
  style?: ViewStyle; // Style personnalisé (optionnel)
  onPress?: () => void; // Handler pour le tap (si applicable)
}

export function Component({ ...props }: ComponentProps) {
  // 1. Calcul des styles avec tokens
  const styles = useTokens(...);
  
  // 2. Render avec composants Suivi
  return (
    <SuiviCard/SuiviText/etc.>
      {/* Contenu */}
    </SuiviCard/SuiviText/etc.>
  );
}
```

### Règles strictes

1. **Aucune valeur hardcodée** : Toutes les couleurs, spacing, radius, typography viennent de `tokens`
2. **Design system exclusif** : Utilisation uniquement des composants Suivi (SuiviCard, SuiviText, etc.)
3. **Props typées** : Interfaces TypeScript complètes pour tous les composants
4. **Réutilisabilité** : Composants génériques et réutilisables dans plusieurs écrans
5. **Documentation inline** : JSDoc dans chaque composant

### Tokens utilisés

Tous les composants utilisent :
- `tokens.colors.*` : Couleurs (brand, accent, neutral, semantic, text, border)
- `tokens.spacing.*` : Espacement (xs, sm, md, lg, xl, xxl)
- `tokens.radius.*` : Rayon de bordure (xs, sm, md, lg, xl, full)
- `tokens.typography.*` : Typographie (display, h1, h2, body, label, caption, mono)
- `tokens.shadows.*` : Ombres (none, sm, card, lg)

### Composition

Les composants peuvent être composés entre eux :
- `StatCard` utilise `SuiviText`
- `TaskItem` utilise `SuiviCard` et `SuiviText`
- `NotificationItem` utilise `SuiviCard` et `SuiviText`
- `UserAvatar` utilise `SuiviText`

### Extensibilité

Pour ajouter de nouveaux composants :

1. Créer le fichier dans `src/components/ui/`
2. Utiliser EXCLUSIVEMENT les tokens Suivi
3. Documenter l'API avec JSDoc
4. Ajouter la documentation dans `docs/mobile/components.md`
5. Intégrer dans les écrans existants si applicable

---

## Notes de développement

- Tous les composants sont stateless et fonctionnels
- Les composants acceptent `style` prop pour personnalisation
- Les composants acceptent `onPress` si applicable pour interaction
- Les types sont exportés pour réutilisation dans d'autres fichiers
- Les composants sont mock-friendly (pas de dépendance externe complexe)

---

## Migration future

Quand `expo-linear-gradient` sera installé, `StatCard` pourra utiliser un gradient au lieu d'une couleur unie :

```typescript
// Dans StatCard.tsx
import { LinearGradient } from 'expo-linear-gradient';

const gradientColors = getGradientColors(); // [primary, primaryDark]
return (
  <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
    {/* Contenu */}
  </LinearGradient>
);
```


