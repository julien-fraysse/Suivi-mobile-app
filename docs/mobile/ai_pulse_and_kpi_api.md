# AI Daily Pulse & Daily KPIs - API Contract

## Vue d'ensemble

Ce document décrit les contrats API pour les deux nouveaux composants de la Home Screen :
- **AI Daily Pulse** : Carte avec insights IA du jour
- **Daily KPIs** : Barre horizontale avec 3 KPIs (tâches ouvertes, échéances, en retard)

---

## 🔮 AI Daily Pulse

### Endpoint

```
GET /api/mobile/ai-daily-pulse
```

### Méthode

`GET`

### Headers

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Response

```json
{
  "importantUpdates": 3,
  "overdue": 2,
  "dueToday": 1,
  "focus": "Design System"
}
```

### Champs et logique UX

| Champ | Type | Description | Usage dans l'UI |
|-------|------|-------------|-----------------|
| `importantUpdates` | `number` | Nombre total de mises à jour importantes | Affiche "X mises à jour importantes" dans le sous-titre |
| `overdue` | `number` | Nombre de tâches en retard | Affiche "X tâche(s) en retard" dans la liste d'insights |
| `dueToday` | `number` | Nombre de tâches dues aujourd'hui | Affiche "X due today" dans la liste d'insights |
| `focus` | `string` | Focus du jour (projet, board, ou thème) | Affiche "Focus du jour : {focus}" dans la liste d'insights |

### Exemple de réponse

```json
{
  "importantUpdates": 3,
  "overdue": 2,
  "dueToday": 1,
  "focus": "Design System"
}
```

### Rendu UI

- **Titre** : "AI Daily Pulse"
- **Sous-titre** : "3 mises à jour importantes"
- **Insights** :
  - "2 tâches en retard"
  - "1 due today"
  - "Focus du jour : Design System"

### Notes backend

- Les valeurs doivent être calculées à partir du compte utilisateur Suivi connecté
- `importantUpdates` = somme de `overdue` + `dueToday` + autres événements importants (optionnel)
- `focus` peut être :
  - Le nom du projet/board le plus actif aujourd'hui
  - Un thème généré par IA basé sur les tâches du jour
  - Une chaîne vide si aucun focus n'est identifié
- **Cache recommandé** : 30 secondes (les données changent peu pendant la journée)
- **Zéro transformation côté mobile** : Le mobile affiche les valeurs telles quelles

### Gestion des erreurs

```json
{
  "error": "Failed to generate AI pulse",
  "message": "Unable to fetch user tasks"
}
```

En cas d'erreur, le composant mobile affiche les données mock par défaut.

---

## 📊 Daily KPIs

### Endpoint

```
GET /api/mobile/kpis
```

### Méthode

`GET`

### Headers

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Response

```json
{
  "openTasks": 7,
  "dueToday": 2,
  "overdue": 1
}
```

### Champs et logique UX

| Champ | Type | Description | Usage dans l'UI |
|-------|------|-------------|-----------------|
| `openTasks` | `number` | Nombre de tâches ouvertes (status !== 'done') | Affiche "X tâche(s) ouverte(s)" avec icône bleue |
| `dueToday` | `number` | Nombre de tâches dues aujourd'hui | Affiche "X échéance(s)" avec icône jaune |
| `overdue` | `number` | Nombre de tâches en retard | Affiche "X en retard" avec icône rouge |

### Exemple de réponse

```json
{
  "openTasks": 7,
  "dueToday": 2,
  "overdue": 1
}
```

### Rendu UI

Barre horizontale avec 3 pills :
- 🟦 **7 tâches ouvertes** (icône bleue `#4F5DFF`)
- 🟨 **2 échéances** (icône jaune `#FFC63A`)
- 🔴 **1 en retard** (icône rouge `#FF3B30`)

### Notes backend

- Les valeurs doivent être calculées à partir du compte utilisateur Suivi connecté
- `openTasks` = toutes les tâches où `status !== 'done'`
- `dueToday` = tâches où `dueDate === today` (comparaison date uniquement, ignore l'heure)
- `overdue` = tâches où `dueDate < today` ET `status !== 'done'`
- **Aucune pagination** : Les KPIs sont des agrégations, pas des listes
- **Cache recommandé** : 30 secondes (les KPIs changent peu pendant la journée)
- **Zéro transformation côté mobile** : Le mobile affiche les valeurs telles quelles

### Gestion des erreurs

```json
{
  "error": "Failed to fetch KPIs",
  "message": "Unable to fetch user tasks"
}
```

En cas d'erreur, le composant mobile affiche les données mock par défaut.

---

## Intégration mobile

### Structure des composants

```
src/components/home/
├── AIDailyPulseCard.tsx
└── DailyKPIs.tsx
```

### Props des composants

#### AIDailyPulseCard

```typescript
interface AIDailyPulseCardProps {
  data?: AIDailyPulseData; // Si non fourni, utilise mock
  style?: any;
}

interface AIDailyPulseData {
  importantUpdates: number;
  overdue: number;
  dueToday: number;
  focus: string;
}
```

#### DailyKPIs

```typescript
interface DailyKPIsProps {
  data?: DailyKPIsData; // Si non fourni, utilise mock
  style?: any;
}

interface DailyKPIsData {
  openTasks: number;
  dueToday: number;
  overdue: number;
}
```

### Exemple d'intégration API

```typescript
// Dans HomeScreen.tsx
const { data: aiPulse } = useQuery('ai-daily-pulse', () =>
  api.get('/api/mobile/ai-daily-pulse')
);

const { data: kpis } = useQuery('daily-kpis', () =>
  api.get('/api/mobile/kpis')
);

// Dans le JSX
<AIDailyPulseCard data={aiPulse} />
<DailyKPIs data={kpis} />
```

### Migration depuis mock

1. **Créer les services API** dans `src/api/` :
   - `getAIDailyPulse()` → `GET /api/mobile/ai-daily-pulse`
   - `getDailyKPIs()` → `GET /api/mobile/kpis`

2. **Utiliser React Query** dans `HomeScreen.tsx` :
   ```typescript
   const { data: aiPulse } = useQuery('ai-daily-pulse', getAIDailyPulse);
   const { data: kpis } = useQuery('daily-kpis', getDailyKPIs);
   ```

3. **Passer les données aux composants** :
   ```tsx
   <AIDailyPulseCard data={aiPulse} />
   <DailyKPIs data={kpis} />
   ```

4. **Gestion d'erreur** : Les composants utilisent les données mock par défaut si `data` est `undefined`

---

## Performance & Cache

### Recommandations backend

- **Cache** : 30 secondes pour les deux endpoints
- **Rate limiting** : Pas nécessaire (données peu fréquentes)
- **Optimisation** : Utiliser des agrégations SQL plutôt que de charger toutes les tâches

### Recommandations mobile

- **React Query** : `staleTime: 30000` (30 secondes)
- **Refetch** : Sur focus de l'écran Home
- **Fallback** : Toujours afficher les données mock si l'API échoue

---

## Tests

### Scénarios de test

1. **Données normales** : Vérifier l'affichage avec des valeurs réalistes
2. **Valeurs zéro** : Vérifier que "0 tâches" s'affiche correctement
3. **Valeurs élevées** : Tester avec 100+ tâches
4. **Erreur API** : Vérifier le fallback vers les données mock
5. **Dark mode** : Vérifier le rendu en mode sombre
6. **Safe area** : Vérifier sur iOS avec encoche

---

## Changelog

- **2024-11-19** : Création initiale des composants avec mock data
- **Future** : Intégration API Suivi Desktop

