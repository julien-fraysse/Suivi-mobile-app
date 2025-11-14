# Suivi Mobile Theme Guidelines

## Theme Structure

The Suivi Mobile theme is built on Material Design 3 and extends `react-native-paper` themes.

## Theme Files

- `/theme/tokens.ts` - Design tokens (colors, spacing, typography, etc.)
- `/theme/paper-theme.ts` - React Native Paper theme configuration
- `/theme/index.ts` - Theme exports

## Design Tokens

### Colors

All colors are defined in `tokens.colors`:

- **Primary**: Brand primary color (#0066FF)
- **Secondary**: Brand secondary color (#00C853)
- **Accent**: Brand accent color (#FF6B35)
- **Neutral**: 50-900 scale for grays
- **Semantic**: success, warning, error, info
- **Background**: default, paper, dark, darkPaper
- **Text**: primary, secondary, disabled, hint, inverse
- **Surface**: default, variant, dark, darkVariant
- **Border**: default, light, dark

### Spacing

Base unit: 4px

```typescript
spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
}
```

### Typography

**Font Families:**
- Primary: Inter
- Mono: IBM Plex Mono

**Font Weights:**
- Thin: 100
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

**Font Sizes:**
- xs: 12px
- sm: 14px
- md: 16px
- lg: 18px
- xl: 20px
- xxl: 24px
- xxxl: 32px

### Border Radius

```typescript
radius = {
  xs: 6,
  sm: 12,
  md: 20,
  lg: 24,
  xl: 32,
  round: 9999,
}
```

### Elevation

Material Design 3 elevation levels:

```typescript
elevation = {
  level0: 0,
  level1: 1,
  level2: 2,
  level3: 4,
  level4: 8,
  level5: 12,
}
```

## Paper Theme

### Light Theme

`suiviLightTheme` extends `MD3LightTheme` with:
- Suivi brand colors
- Roundness: 12px
- Inter font family
- Custom surface and background colors

### Dark Theme

`suiviDarkTheme` extends `MD3DarkTheme` with:
- Adjusted Suivi brand colors for dark mode
- Same roundness and typography as light theme
- Dark-optimized surface colors

## Using the Theme

### In Components

```tsx
import { useTheme } from 'react-native-paper';
import { tokens } from '../theme';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.onSurface }}>
        Themed text
      </Text>
    </View>
  );
};
```

### Using Tokens

```tsx
import { tokens } from '../theme';

const MyComponent = () => {
  return (
    <View style={{
      padding: tokens.spacing.md,
      borderRadius: tokens.radius.sm,
      backgroundColor: tokens.colors.primary,
    }}>
      <Text style={{
        fontSize: tokens.typography.fontSize.md,
        fontFamily: tokens.typography.fontFamily.primary,
      }}>
        Using tokens
      </Text>
    </View>
  );
};
```

### Theme Provider

Wrap your app with `PaperProvider`:

```tsx
import { PaperProvider } from 'react-native-paper';
import { suiviTheme } from './theme';

export default function App() {
  return (
    <PaperProvider theme={suiviTheme}>
      {/* Your app */}
    </PaperProvider>
  );
}
```

## Color Usage Guidelines

### Primary Colors
- Use for primary actions, links, and brand elements
- Ensure sufficient contrast with background

### Secondary Colors
- Use for secondary actions and accents
- Complementary to primary color

### Semantic Colors
- **Success**: Confirmation, success states
- **Warning**: Warnings, caution states
- **Error**: Errors, destructive actions
- **Info**: Informational messages

### Text Colors
- **Primary**: Main text content
- **Secondary**: Supporting text
- **Disabled**: Disabled state text
- **Hint**: Placeholder text
- **Inverse**: Text on dark backgrounds

### Surface Colors
- **Default**: Main surface color
- **Variant**: Alternative surface (cards, sheets)
- Use elevation to create depth

## Best Practices

1. **Always use tokens** - Never hardcode colors or spacing
2. **Use semantic names** - `primary`, `error`, not hex codes
3. **Test both themes** - Ensure components work in light and dark
4. **Maintain contrast** - Follow WCAG AA guidelines
5. **Use elevation appropriately** - Follow MD3 elevation guidelines

## Theme Customization

To customize the theme:

1. Modify tokens in `/theme/tokens.ts`
2. Update Paper theme in `/theme/paper-theme.ts`
3. Ensure both light and dark themes are updated
4. Test all components with new theme values

## Resources

- [Material Design 3 Color System](https://m3.material.io/styles/color/the-color-system/overview)
- [React Native Paper Theming](https://callstack.github.io/react-native-paper/theming.html)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

