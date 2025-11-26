import React, { useEffect, useRef } from 'react';
import {
  Switch,
  SwitchProps,
  ViewStyle,
  Platform,
  Animated,
  Pressable,
  StyleSheet,
} from 'react-native';
import { tokens } from '@theme';

export interface SuiviSwitchProps {
  /** Valeur actuelle du switch (true = activé, false = désactivé) */
  value: boolean;
  /** Callback appelé lorsque la valeur change */
  onValueChange: (value: boolean) => void;
  /** Style optionnel pour le conteneur */
  style?: ViewStyle;
  /** Props supplémentaires pour le Switch React Native */
  disabled?: boolean;
}

/**
 * SuiviSwitch
 * 
 * Composant Switch stylé Material Design 3, cohérent avec le design Suivi.
 * 
 * Comportement selon la plateforme :
 * - Web : Toggle custom animé (Views + Pressable + Animated) pour garantir
 *   le rendu violet sur Expo Web (le Switch natif garde la couleur verte par défaut)
 * - iOS/Android : Switch natif stylé MD3 avec couleurs Suivi
 * 
 * Dimensions MD3 :
 * - Track : 52x28, borderRadius: 28 (complet)
 * - Thumb : 20x20, borderRadius: 20 (complet)
 * 
 * Couleurs MD3 :
 * - Track OFF : tokens.colors.neutral.light (#E8E8E8)
 * - Track ON : tokens.colors.brand.primary avec opacité 28% (hex "47")
 * - Thumb OFF : #FFFFFF (blanc)
 * - Thumb ON : tokens.colors.brand.primary (#4F5DFF)
 * 
 * Animation :
 * - Translation du thumb : 0 → 24px (52 - 20 - 4*2)
 * - Scale léger pendant l'appui : 0.95
 * - Durée : tokens.animation.normal (250ms)
 * 
 * Utilise EXCLUSIVEMENT les tokens Suivi :
 * - tokens.colors.neutral.light, tokens.colors.brand.primary
 * - tokens.animation.normal
 */
export function SuiviSwitch({
  value,
  onValueChange,
  style,
  disabled = false,
  ...otherProps
}: SuiviSwitchProps & Omit<SwitchProps, 'value' | 'onValueChange'>) {
  const isWeb = Platform.OS === 'web';
  const primaryWithOpacity = tokens.colors.brand.primary + '47'; // 47 = 28% d'opacité en hex
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateXAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  // Animation du thumb lors du changement de valeur
  useEffect(() => {
    Animated.timing(translateXAnim, {
      toValue: value ? 1 : 0,
      duration: tokens.animation.normal,
      useNativeDriver: true,
    }).start();
  }, [value, translateXAnim]);

  // Animation de scale pendant l'appui
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  // Interpolation pour la position du thumb
  const translateX = translateXAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 24], // 4px padding de départ, 24px = 52 - 20 - 4*2
  });

  // Toggle custom pour Web
  if (isWeb) {
    return (
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[styles.webContainer, style]}
      >
        <Animated.View
          style={[
            styles.track,
            {
              backgroundColor: value ? primaryWithOpacity : tokens.colors.neutral.light,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [
                  { translateX },
                  { scale: scaleAnim },
                ],
                backgroundColor: value ? tokens.colors.brand.primary : '#FFFFFF',
              },
            ]}
          />
        </Animated.View>
      </Pressable>
    );
  }

  // Switch natif pour iOS/Android
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: tokens.colors.neutral.light,
        true: primaryWithOpacity,
      }}
      thumbColor={value ? tokens.colors.brand.primary : '#FFFFFF'}
      ios_backgroundColor={tokens.colors.neutral.light}
      tintColor={tokens.colors.neutral.light}
      onTintColor={primaryWithOpacity}
      style={style}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  webContainer: {
    width: 52,
    height: 28,
  },
  track: {
    width: 52,
    height: 28,
    borderRadius: 28,
    justifyContent: 'center',
    padding: 4,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
});

