# Suivi Mobile Design Guidelines

## Overview

The Suivi Mobile Design System is built on Material Design 3 principles, customized with Suivi brand colors, typography, and spacing tokens.

## Design Principles

### 1. Consistency
- All components use centralized design tokens
- No inline colors or spacing values
- Consistent elevation and shadow patterns

### 2. Accessibility
- WCAG AA compliant color contrasts
- Touch targets minimum 44x44 points
- Clear visual hierarchy

### 3. Material Design 3
- MD3 elevation system (0-5 levels)
- MD3 color system (primary, secondary, tertiary)
- MD3 typography scale
- MD3 component states (pressed, disabled, hover)

## Brand Identity

### Colors
- **Primary**: #0066FF (Blue)
- **Secondary**: #00C853 (Green)
- **Accent**: #FF6B35 (Orange)

### Typography
- **Primary Font**: Inter
- **Monospace Font**: IBM Plex Mono
- Font weights: Thin (100), Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing
- Base unit: 4px
- Scale: 4, 8, 16, 24, 32, 48, 64

### Border Radius
- Small: 6px
- Medium: 12px
- Large: 20px

## Component Usage

All components are located in `/components/ui` and follow these patterns:

1. **Props extend React Native Paper primitives**
2. **Consume tokens from `/theme/tokens.ts`**
3. **Support MD3 states (pressed, disabled, focused)**
4. **Responsive to theme changes (light/dark)**

## Theming

The app supports light and dark themes through `react-native-paper`:

- Light theme: `suiviLightTheme`
- Dark theme: `suiviDarkTheme`
- Default: `suiviTheme` (light)

## Best Practices

1. **Always use design tokens** - Never hardcode colors or spacing
2. **Use semantic color names** - `primary`, `secondary`, `error`, etc.
3. **Follow MD3 elevation guidelines** - Use elevation 0-5 appropriately
4. **Maintain touch targets** - Minimum 44x44 points for interactive elements
5. **Test in both themes** - Ensure components work in light and dark modes

## Resources

- [Material Design 3 Guidelines](https://m3.material.io/)
- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
- Component examples in `/components/ui`

