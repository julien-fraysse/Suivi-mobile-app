import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Settings
 * 
 * Application settings structure
 */
export interface Settings {
  language: 'fr' | 'en';
  theme: 'light' | 'dark' | 'system';
}

/**
 * Settings Context Value
 * 
 * Context exposing the current settings and update function
 */
export type SettingsContextValue = {
  settings: Settings;
  updateSettings: (partialSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

/**
 * useSettings
 * 
 * Hook to access the settings context and update settings.
 * 
 * @returns {SettingsContextValue} The settings context with settings and updateSettings
 */
export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export interface SettingsProviderProps {
  children: ReactNode;
}

// Storage key for persisted settings
const SETTINGS_STORAGE_KEY = '@suivi_app_settings';

// Default settings
const DEFAULT_SETTINGS: Settings = {
  language: 'fr',
  theme: 'system',
};

/**
 * SettingsProvider
 * 
 * Global settings provider for the application.
 * 
 * Features:
 * - Manages app settings (language, theme)
 * - Persists settings to AsyncStorage
 * - Loads persisted settings on app startup
 * - Merges partial updates with existing settings
 * 
 * @param {ReactNode} children - The children to wrap
 */
export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings) as Settings;
          setSettings({
            ...DEFAULT_SETTINGS,
            ...parsedSettings, // Merge with defaults to handle new fields
          });
        }
      } catch (error) {
        console.error('Error loading settings from storage:', error);
        // Fallback to default settings on error
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  /**
   * Update settings
   * 
   * Merges partial settings with existing settings and persists to AsyncStorage
   * 
   * @param {Partial<Settings>} partialSettings - Partial settings to merge
   */
  const updateSettings = async (partialSettings: Partial<Settings>) => {
    try {
      const newSettings = {
        ...settings,
        ...partialSettings,
      };
      
      // Update state immediately
      setSettings(newSettings);
      
      // Persist to AsyncStorage
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings to storage:', error);
      // Revert on error - use functional setState to get current state
      setSettings((prevSettings) => prevSettings);
      throw error;
    }
  };

  /**
   * Reset settings to defaults
   * 
   * Resets all settings to default values and clears AsyncStorage
   */
  const resetSettings = async () => {
    try {
      setSettings(DEFAULT_SETTINGS);
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  };

  const value: SettingsContextValue = {
    settings,
    updateSettings,
    resetSettings,
  };

  // Don't render children until settings are loaded
  if (isLoading) {
    return null; // Or a loading spinner if needed
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

