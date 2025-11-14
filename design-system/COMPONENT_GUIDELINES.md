# Suivi Mobile Component Guidelines

## Component Library

All UI components are located in `/components/ui` and built on `react-native-paper` primitives.

## Available Components

### SuiviButton
Primary button component with variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outlined' | 'text'
- `size`: 'small' | 'medium' | 'large'

**Usage:**
```tsx
<SuiviButton variant="primary" size="medium" onPress={handlePress}>
  Click Me
</SuiviButton>
```

### SuiviText
Typography component with semantic variants.

**Props:**
- `variant`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline'
- `color`: 'primary' | 'secondary' | 'disabled' | 'hint' | 'inverse'
- `weight`: 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold'

**Usage:**
```tsx
<SuiviText variant="h1" color="primary" weight="bold">
  Heading
</SuiviText>
```

### SuiviCard
Card component with elevation support.

**Props:**
- `elevation`: 0 | 1 | 2 | 3 | 4 | 5
- `padding`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'

**Usage:**
```tsx
<SuiviCard elevation={2} padding="md">
  <SuiviText>Card Content</SuiviText>
</SuiviCard>
```

### SuiviTextInput
Text input with outlined and flat variants.

**Props:**
- `variant`: 'outlined' | 'flat'
- `size`: 'small' | 'medium' | 'large'

**Usage:**
```tsx
<SuiviTextInput
  variant="outlined"
  label="Email"
  value={email}
  onChangeText={setEmail}
/>
```

### SuiviAppBar
App bar component with elevation.

**Props:**
- `variant`: 'small' | 'medium' | 'large' | 'center-aligned'
- `elevation`: 0 | 1 | 2 | 3 | 4 | 5

**Usage:**
```tsx
<SuiviAppBar variant="medium" elevation={2}>
  <Appbar.BackAction onPress={goBack} />
  <Appbar.Content title="Screen Title" />
</SuiviAppBar>
```

### SuiviListItem
List item component with consistent styling.

**Props:**
- `variant`: 'default' | 'inset' | 'avatar'

**Usage:**
```tsx
<SuiviListItem
  title="Item Title"
  description="Item description"
  left={props => <List.Icon {...props} icon="folder" />}
/>
```

### SuiviChip
Chip component for tags and filters.

**Props:**
- `variant`: 'flat' | 'outlined'
- `size`: 'small' | 'medium'

**Usage:**
```tsx
<SuiviChip variant="flat" size="medium">
  Tag
</SuiviChip>
```

### SuiviDivider
Divider component with spacing options.

**Props:**
- `variant`: 'fullWidth' | 'inset' | 'middle'
- `spacing`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'

**Usage:**
```tsx
<SuiviDivider variant="fullWidth" spacing="md" />
```

### SuiviAvatar
Avatar component with size variants.

**Props:**
- `size`: 'small' | 'medium' | 'large' | number

**Usage:**
```tsx
<SuiviAvatar size="medium" label="JD" />
```

### SuiviSurface
Surface component with elevation and padding.

**Props:**
- `elevation`: 0 | 1 | 2 | 3 | 4 | 5
- `padding`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
- `variant`: 'default' | 'variant'

**Usage:**
```tsx
<SuiviSurface elevation={1} padding="md">
  <SuiviText>Surface Content</SuiviText>
</SuiviSurface>
```

### SuiviLogo
Logo component with multiple variants.

**Props:**
- `variant`: 'full-light' | 'full-dark' | 'icon' | 'icon-white' | 'horizontal' | 'horizontal-white'
- `size`: number
- `width`: number
- `height`: number

**Usage:**
```tsx
<SuiviLogo variant="full-light" size={200} />
```

## Layout Components

### ScreenContainer
Safe area container with theme background and padding.

**Props:**
- `padding`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
- `safeAreaEdges`: ('top' | 'bottom' | 'left' | 'right')[]

**Usage:**
```tsx
<ScreenContainer padding="md">
  <SuiviText>Screen Content</SuiviText>
</ScreenContainer>
```

## Media Components

### SuiviLogoFull
Full logo component (light/dark variants).

**Props:**
- `variant`: 'light' | 'dark'
- `size`: number
- `width`: number
- `height`: number

### SuiviLogoIcon
Icon-only logo component.

**Props:**
- `variant`: 'default' | 'white'
- `size`: number

### SuiviLogoHorizontal
Horizontal logo component.

**Props:**
- `variant`: 'default' | 'white'
- `width`: number
- `height`: number

## Component Composition

All components:
- Extend React Native Paper primitives
- Consume tokens from `/theme/tokens.ts`
- Support MD3 states automatically
- Respond to theme changes
- Follow accessibility best practices

## Extending Components

When creating new components:

1. Import tokens from `/theme/tokens.ts`
2. Use `useTheme()` hook for theme colors
3. Support both light and dark themes
4. Follow MD3 elevation guidelines
5. Use semantic color names
6. Maintain consistent spacing

