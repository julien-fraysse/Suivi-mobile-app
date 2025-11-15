import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';

import { PaperProvider } from 'react-native-paper';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { suiviTheme } from './theme';

// Navigation root (to be created later)
import RootNavigator from './navigation/RootNavigator';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={suiviTheme}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="auto" />
      </PaperProvider>
    </QueryClientProvider>
  );
}
