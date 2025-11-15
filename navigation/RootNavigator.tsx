import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/layout';
import { SuiviText } from '../components';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/*
        We will insert:
        - AuthNavigator
        - MainTabNavigator
      */}
      <Stack.Screen
        name="Placeholder"
        component={() => (
          <ScreenContainer>
            <SuiviText variant="h1">Suivi Mobile App</SuiviText>
            <SuiviText variant="body2" color="secondary">
              Navigation structure ready - Add AuthNavigator and MainTabNavigator
            </SuiviText>
          </ScreenContainer>
        )}
      />
    </Stack.Navigator>
  );
}
