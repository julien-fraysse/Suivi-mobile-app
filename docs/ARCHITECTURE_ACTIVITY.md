# Architecture - Système d'Activités Récentes

## Vue d'ensemble

Ce document décrit l'architecture du système d'activités récentes dans l'application Suivi Mobile, incluant les composants, les modals, et leur intégration dans l'écran Home.

**Date de création :** 2024-12-XX  
**Dernière mise à jour :** 2024-12-XX

---

## 1. Structure des Composants

### 1.1 Composants Principaux

```
src/components/activity/
├── ActivityCard.tsx          # Carte d'activité réutilisable (liste)
├── RecentActivityModal.tsx   # Modal avec liste complète d'activités
└── ActivityDetailModal.tsx   # Modal de détail d'une activité
```

### 1.2 Types et Données

```
src/types/
└── activity.ts              # Types TypeScript (SuiviActivityEvent, etc.)

src/api/
└── activity.ts              # API adapter (getRecentActivity)

src/mocks/data/
└── activity.ts              # Données mockées (getMockRecentActivity)
```

---

## 2. Composants Détaillés

### 2.1 ActivityCard

**Fichier :** `src/components/activity/ActivityCard.tsx`

**Rôle :** Affiche une carte d'activité récente dans une liste.

**Props :**
- `event: SuiviActivityEvent` - Événement à afficher
- `onPress?: () => void` - Callback au clic
- `style?: ViewStyle` - Style personnalisé

**Design :**
- Layout horizontal : bloc graphique (48x48px) à gauche + texte à droite
- Bloc graphique : couleur selon `source` et `eventType` + icône MaterialCommunityIcons
- Texte : 3 lignes (titre, contexte workspace/board/portail, meta avec avatar + temps + badge sévérité)
- Support dark/light mode complet

**Utilisation :**
```tsx
<ActivityCard
  event={activityEvent}
  onPress={() => handleSelectActivity(activityEvent)}
/>
```

---

### 2.2 RecentActivityModal

**Fichier :** `src/components/activity/RecentActivityModal.tsx`

**Rôle :** Modal slide-up affichant la liste complète des activités récentes avec filtres et swipe-to-delete.

**Props :**
- `visible: boolean` - Contrôle la visibilité
- `onClose: () => void` - Callback de fermeture
- `onSelect?: (event: SuiviActivityEvent) => void` - Callback de sélection d'une activité

**Fonctionnalités :**
- **Chargement :** Appelle `getRecentActivity()` depuis `src/api/activity.ts`
- **Tri :** Anti-chronologique (plus récent en premier)
- **Grouping :** Par date (Aujourd'hui, Hier, Cette semaine, Plus ancien)
- **Filtres :** Pills "Tous / Boards / Portails"
- **Swipe-to-delete :** Suppression locale uniquement (pas de sync backend)
- **Liste scrollable :** Utilise `ActivityCard` pour chaque événement

**Logique de filtrage :**
- "Tous" : affiche tous les événements (BOARD et PORTAL)
- "Boards" : `event.source === 'BOARD'`
- "Portails" : `event.source === 'PORTAL'`

**Comportement de swipe :**
- Swipe droite → gauche sur une `ActivityCard`
- Affiche action de suppression (rouge)
- Supprime du state local uniquement
- L'événement réapparaîtra au prochain chargement depuis l'API

**Utilisation :**
```tsx
<RecentActivityModal
  visible={isModalVisible}
  onClose={() => setIsModalVisible(false)}
  onSelect={(event) => {
    setSelectedActivity(event);
    setDetailModalVisible(true);
  }}
/>
```

---

### 2.3 ActivityDetailModal

**Fichier :** `src/components/activity/ActivityDetailModal.tsx`

**Rôle :** Modal slide-up affichant le détail complet d'une activité récente.

**Props :**
- `visible: boolean` - Contrôle la visibilité
- `event: SuiviActivityEvent | null` - Événement à afficher (null si fermé)
- `onClose: () => void` - Callback de fermeture

**Affichage :**
- **Icône/illustration :** Bloc graphique (96x96px) avec couleur selon source/eventType
- **Titre :** `event.title` centré
- **Heure :** Relative ("Il y a 2h") + date complète formatée en français
- **Acteur :** Avatar (40px) + nom
- **Contexte :** "Workspace · Board/Portail"
- **Type d'événement :** Badge avec label français
- **Statut :** Ancien → nouveau (si applicable)
- **Dates :** Prévue → finale (pour TASK_REPLANNED)
- **Sévérité :** Badge coloré

**Actions :**
- Bouton "Ouvrir dans Suivi (web)" en bas
- Utilise `Linking.openURL()` avec URL placeholder
- TODO : Intégration future avec deep links Suivi

**Intégration future avec Suivi web :**
- URLs deep-linkées selon le type :
  - Tâches : `https://app.suivi.fr/workspaces/{workspaceId}/boards/{boardId}/tasks/{taskId}`
  - Objectifs : `https://app.suivi.fr/workspaces/{workspaceId}/boards/{boardId}/objectives/{objectiveId}`
  - Boards : `https://app.suivi.fr/workspaces/{workspaceId}/boards/{boardId}`
  - Portails : `https://app.suivi.fr/portals/{portalId}`

**Utilisation :**
```tsx
<ActivityDetailModal
  visible={isDetailVisible}
  event={selectedActivity}
  onClose={() => {
    setIsDetailVisible(false);
    setSelectedActivity(null);
  }}
/>
```

---

## 3. Intégration Home

### 3.1 Carte "Activités récentes" sur HomeScreen

**Fichier :** `src/screens/HomeScreen.tsx`

**Emplacement :** Section "Activités récentes" (remplace l'ancienne section "Recent Activity")

**Design :**
- Carte cliquable (`TouchableOpacity` + `SuiviCard`)
- Aperçu des 1 à 3 premières activités (titre uniquement, une ligne)
- Indicateur "+X autres activités" si plus de 3
- Footer avec "Voir les activités" + chevron
- États : loading (skeleton), error, empty, data

**Code :**
```tsx
<TouchableOpacity onPress={handleOpenRecentActivity}>
  <SuiviCard>
    {/* Aperçu des activités */}
    {activities.slice(0, 3).map((activity) => (
      <SuiviText numberOfLines={1}>
        {activity.title}
      </SuiviText>
    ))}
    {/* Footer */}
    <View>
      <SuiviText color="primary">Voir les activités</SuiviText>
      <MaterialCommunityIcons name="chevron-right" />
    </View>
  </SuiviCard>
</TouchableOpacity>
```

### 3.2 Gestion des States

**States dans HomeScreen :**
```tsx
const [recentActivityModalVisible, setRecentActivityModalVisible] = useState(false);
const [selectedActivity, setSelectedActivity] = useState<SuiviActivityEvent | null>(null);
const [activityDetailModalVisible, setActivityDetailModalVisible] = useState(false);
```

**Handlers :**
```tsx
// Ouvrir le modal d'activités récentes
const handleOpenRecentActivity = () => {
  setRecentActivityModalVisible(true);
};

// Fermer le modal d'activités récentes
const handleCloseRecentActivity = () => {
  setRecentActivityModalVisible(false);
};

// Sélectionner une activité (ouvre le détail)
const handleSelectActivity = (event: SuiviActivityEvent) => {
  setSelectedActivity(event);
  setActivityDetailModalVisible(true);
};

// Fermer le modal de détail
const handleCloseActivityDetail = () => {
  setActivityDetailModalVisible(false);
  setSelectedActivity(null);
};
```

### 3.3 Navigation Utilisateur

**Flux complet :**

1. **HomeScreen → RecentActivityModal**
   - Utilisateur clique sur la carte "Activités récentes"
   - `handleOpenRecentActivity()` → `setRecentActivityModalVisible(true)`
   - Le modal slide-up depuis le bas avec la liste complète

2. **RecentActivityModal → ActivityDetailModal**
   - Utilisateur clique sur une `ActivityCard` dans le modal
   - `onSelect(event)` est appelé → `handleSelectActivity(event)`
   - `setSelectedActivity(event)` + `setActivityDetailModalVisible(true)`
   - Le modal de détail s'ouvre par-dessus (ou remplace, selon l'implémentation)

3. **ActivityDetailModal → Suivi Web**
   - Utilisateur clique sur "Ouvrir dans Suivi (web)"
   - `Linking.openURL(url)` ouvre le navigateur avec l'URL deep-linkée
   - TODO : Construire l'URL selon le type d'événement

**Diagramme de flux :**
```
HomeScreen (carte aperçu)
    ↓ (clic)
RecentActivityModal (liste complète)
    ↓ (clic sur ActivityCard)
ActivityDetailModal (détail)
    ↓ (clic "Ouvrir dans Suivi")
Suivi Web (navigateur)
```

### 3.4 Intégration dans HomeScreen

**Imports :**
```tsx
import { RecentActivityModal } from '../components/activity/RecentActivityModal';
import { ActivityDetailModal } from '../components/activity/ActivityDetailModal';
import type { SuiviActivityEvent } from '../types/activity';
```

**Rendu des modals :**
```tsx
<RecentActivityModal
  visible={recentActivityModalVisible}
  onClose={handleCloseRecentActivity}
  onSelect={handleSelectActivity}
/>

<ActivityDetailModal
  visible={activityDetailModalVisible}
  event={selectedActivity}
  onClose={handleCloseActivityDetail}
/>
```

**Données :**
- Utilise `useActivityFeed(5)` pour récupérer les 5 premières activités
- Les données sont affichées dans l'aperçu de la carte
- Le modal charge ses propres données via `getRecentActivity()` (limite 50)

---

## 4. API et Données

### 4.1 API Adapter

**Fichier :** `src/api/activity.ts`

**Fonction principale :**
```typescript
export async function getRecentActivity(
  accessToken?: string | null,
  options: GetRecentActivityOptions = {},
): Promise<SuiviActivityEvent[]>
```

**Options :**
- `limit?: number` - Nombre max d'événements (défaut: 20)
- `workspaceId?: string` - Filtrer par workspace
- `severity?: 'INFO' | 'IMPORTANT' | 'CRITICAL'` - Filtrer par sévérité
- `source?: 'BOARD' | 'PORTAL'` - Filtrer par source

**Mode mock :**
- Si `USE_MOCK_API = true` : retourne `getMockRecentActivity()` avec filtres appliqués
- Simule un délai réseau (200ms)

**Mode production (TODO) :**
- Appel HTTP vers `GET /api/v1/me/activity/recent`
- Authentification : Bearer token dans header
- Paramètres de requête selon `options`

### 4.2 Types TypeScript

**Fichier :** `src/types/activity.ts`

**Types principaux :**
- `SuiviActivityEvent` - Structure complète d'un événement
- `SuiviActivitySource` - 'BOARD' | 'PORTAL'
- `SuiviActivityEventType` - Types d'événements (TASK_CREATED, etc.)
- `SuiviActivitySeverity` - 'INFO' | 'IMPORTANT' | 'CRITICAL'
- Interfaces pour `taskInfo`, `objectiveInfo`, `boardInfo`, `portalInfo`

---

## 5. Design System

### 5.1 Tokens Utilisés

- **Couleurs :** `tokens.colors.brand.primary`, `tokens.colors.accent.maize`, `tokens.colors.semantic.error`, etc.
- **Spacing :** `tokens.spacing.xs`, `tokens.spacing.sm`, `tokens.spacing.md`, etc.
- **Radius :** `tokens.radius.sm`, `tokens.radius.md`, `tokens.radius.lg`, `tokens.radius.xl`
- **Typography :** Via `SuiviText` avec variants ('h1', 'h2', 'body', 'label')

### 5.2 Support Dark/Light Mode

- Tous les composants utilisent `useTheme()` de `react-native-paper`
- Couleurs adaptées selon `theme.dark`
- Tokens dark mode : `tokens.colors.text.dark.primary`, `tokens.colors.surface.darkElevated`, etc.

---

## 6. Points d'Attention

### 6.1 Performance

- **Chargement initial :** `useActivityFeed(5)` charge seulement 5 activités pour l'aperçu
- **Modal :** `getRecentActivity()` charge jusqu'à 50 activités
- **Cache :** React Query gère le cache pour `useActivityFeed`
- **Swipe-to-delete :** Suppression locale uniquement (pas de requête API)

### 6.2 Navigation

- **Pas de navigation stack :** Les modals sont des composants React Native `Modal`, pas des écrans de navigation
- **Pas de deep linking :** Pour l'instant, le bouton "Ouvrir dans Suivi" utilise une URL placeholder
- **Pas d'ouverture native :** Les boards/portails ne s'ouvrent pas dans l'app native (seulement web)

### 6.3 États et Synchronisation

- **State local :** `RecentActivityModal` gère son propre state pour les événements
- **Suppression locale :** Le swipe-to-delete supprime uniquement du state local
- **Rafraîchissement :** Le modal recharge les données à chaque ouverture
- **Pas de sync :** Les suppressions locales ne sont pas synchronisées avec le backend

---

## 7. Fichiers Clés

### Composants
- `src/components/activity/ActivityCard.tsx`
- `src/components/activity/RecentActivityModal.tsx`
- `src/components/activity/ActivityDetailModal.tsx`

### Types
- `src/types/activity.ts`

### API
- `src/api/activity.ts`
- `src/mocks/data/activity.ts`

### Écrans
- `src/screens/HomeScreen.tsx`

### Hooks
- `src/hooks/useActivity.ts` (utilise `useActivityFeed`)

---

## 8. TODO et Améliorations Futures

### 8.1 Deep Links Suivi Web

- [ ] Construire les URLs deep-linkées selon le type d'événement
- [ ] Récupérer les IDs réels (workspaceId, boardId, taskId, etc.) depuis l'événement
- [ ] Gérer l'authentification (token dans l'URL ou header)
- [ ] Tester les deep links sur iOS/Android

### 8.2 Synchronisation Backend

- [ ] Implémenter la suppression réelle via API
- [ ] Synchroniser les suppressions locales avec le backend
- [ ] Gérer les erreurs de synchronisation

### 8.3 Fonctionnalités Supplémentaires

- [ ] Marquer comme lu / non lu
- [ ] Pagination si beaucoup d'activités
- [ ] Filtres avancés (par workspace, par date, etc.)
- [ ] Actions contextuelles (ex: marquer comme lu depuis le détail)

---

## Conclusion

Le système d'activités récentes est bien structuré avec :
- Composants réutilisables (`ActivityCard`)
- Modals séparés pour liste et détail
- Intégration simple dans HomeScreen
- Support complet dark/light mode
- Architecture prête pour l'intégration backend

L'intégration dans HomeScreen est minimale : la Home ne fait qu'afficher une carte d'aperçu et gérer les states des modals. Toute la logique complexe reste dans les composants `RecentActivityModal` et `ActivityDetailModal`.


