# UI Buttons Documentation

## Overview

This document describes the button components available in the Suivi Mobile App UI library.

---

## AiBriefingButton

### Location

`src/components/ui/AiBriefingButton.tsx`

### Description

Modern gradient button for accessing the "AI Daily Briefing" feature. Features a premium design with violet gradient, shadow effects, and clear visual hierarchy.

### Design Specifications

- **Height**: 64px
- **Horizontal Margins**: 16px
- **Border Radius**: 20px (matches design system)
- **Gradient**: Linear gradient 90deg from `#7A5CFF` to `#4F5DFF`
- **Shadow**: Light shadow adapted for light/dark mode
- **Layout**: Icon (left) + Text column (center) + Arrow (right)

### Structure

```
┌─────────────────────────────────────────────┐
│ [magic icon]  AI Daily Briefing        [→]  │
│              Synthétise mes tâches           │
└─────────────────────────────────────────────┘
```

### Props

```typescript
interface AiBriefingButtonProps {
  /**
   * Callback appelé quand le bouton est pressé
   * 
   * TODO: When Suivi API is ready, this will trigger:
   *   - API call to POST /api/briefing/generate
   *   - Navigation to BriefingScreen with generated content
   */
  onPress?: () => void;
  
  /**
   * Style personnalisé pour le conteneur
   */
  style?: any;
}
```

### Usage

```tsx
import { AiBriefingButton } from '../components/ui/AiBriefingButton';

<AiBriefingButton
  onPress={() => {
    // TODO: Navigate to BriefingScreen when API is ready
    // navigation.navigate('Briefing', { date: new Date() });
  }}
/>
```

### Visual Elements

1. **Icon** (left): `MaterialCommunityIcons` "magic", size 22, white
2. **Title** (center): "AI Daily Briefing", semi-bold (600), white
3. **Subtitle** (center): "Synthétise mes tâches", small label, white with 80% opacity
4. **Arrow** (right): `MaterialCommunityIcons` "arrow-right", size 20, white

### Styling Details

- **Padding**: Vertical 14px, Horizontal 18px
- **Gap**: 12px between icon and text
- **Container**: `overflow: hidden` to properly display gradient
- **Shadow**: 
  - Light mode: `#7A5CFF` with 20% opacity
  - Dark mode: `#000` with 30% opacity
- **Press State**: Opacity 0.9 when pressed

### Internationalization

- **Title**: `t('notifications.aiBriefing')`
- **Subtitle**: `t('notifications.aiBriefingSubtitle')`

Translation keys:
- `fr.json`: `"aiBriefing": "AI Daily Briefing"`, `"aiBriefingSubtitle": "Synthétise mes tâches"`
- `en.json`: `"aiBriefing": "Get AI Daily Briefing"`, `"aiBriefingSubtitle": "Synthesize my tasks"`

---

## API Integration (Future)

### Endpoint

```
POST /api/briefing/generate
```

### Request Body

```json
{
  "userId": "user-123",
  "date": "2024-11-19",
  "filters": {
    "status": ["todo", "in_progress"],
    "dueDate": "today"
  }
}
```

### Response

```json
{
  "summary": "Vous avez 5 tâches actives aujourd'hui...",
  "tasks": [
    {
      "id": "task-1",
      "title": "Implémenter le design system",
      "status": "in_progress",
      "dueDate": "2024-11-19"
    }
  ],
  "insights": [
    "3 tâches sont en retard",
    "2 tâches sont dues aujourd'hui"
  ],
  "generatedAt": "2024-11-19T10:00:00Z"
}
```

### Integration Steps

1. **Create BriefingScreen**: New screen to display the generated briefing
2. **Add API Service**: Create `src/api/briefing.ts` with `generateBriefing()` function
3. **Update Button Handler**: Replace no-op handler with API call and navigation
4. **Add Loading State**: Show loading indicator while generating briefing
5. **Error Handling**: Display error message if API call fails

### Example Implementation

```typescript
const handleBriefingPress = async () => {
  try {
    setIsLoading(true);
    const briefing = await generateBriefing({
      userId: currentUser.id,
      date: new Date(),
      filters: { status: ['todo', 'in_progress'] }
    });
    navigation.navigate('Briefing', { briefing });
  } catch (error) {
    showErrorToast('Erreur lors de la génération du briefing');
  } finally {
    setIsLoading(false);
  }
};
```

---

## Dependencies

- `expo-linear-gradient`: For gradient background effect
- `@expo/vector-icons`: For MaterialCommunityIcons
- `react-native-paper`: For theme support
- `react-i18next`: For internationalization

---

## Related Components

- `SuiviButton`: Standard button component for general use
- `StatCard`: Card component for statistics display
- `TasksFilterControl`: Filter control for task lists

---

## Design System Alignment

- **Colors**: Uses Suivi brand violet gradient (`#7A5CFF` → `#4F5DFF`)
- **Typography**: Uses `SuiviText` component with design tokens
- **Spacing**: Uses `tokens.spacing` for consistent margins and padding
- **Radius**: Uses `tokens.radius.xl` (20px) for rounded corners
- **Shadows**: Uses theme-aware shadow system

---

## Notes

- The button is currently used in `MyTasksScreen` only
- The button was previously in `NotificationsScreen` but has been moved
- The gradient effect requires `expo-linear-gradient` package
- The button supports both light and dark themes automatically

