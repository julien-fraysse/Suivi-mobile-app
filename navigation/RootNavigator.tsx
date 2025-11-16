import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, View, StyleSheet, Text } from 'react-native';
import { SuiviLogo } from '../components/ui/SuiviLogo';

const Stack = createNativeStackNavigator();

function DebugScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Suivi Mobile – Debug Screen</Text>
        <Text style={styles.subtitle}>
          If you see this, navigation + assets are working.
        </Text>
        
        <View style={styles.logoSection}>
          <View style={styles.logoItem}>
            <Text style={styles.logoLabel}>full-light (160x40):</Text>
            <SuiviLogo variant="full-light" width={160} height={40} />
          </View>
          
          <View style={styles.logoItem}>
            <Text style={styles.logoLabel}>full-dark:</Text>
            <SuiviLogo variant="full-dark" width={160} height={40} />
          </View>
          
          <View style={styles.logoItem}>
            <Text style={styles.logoLabel}>icon:</Text>
            <SuiviLogo variant="icon" width={80} height={80} />
          </View>
          
          <View style={styles.logoItem}>
            <Text style={styles.logoLabel}>icon-white:</Text>
            <SuiviLogo variant="icon-white" width={80} height={80} />
          </View>
          
          <View style={styles.logoItem}>
            <Text style={styles.logoLabel}>horizontal:</Text>
            <SuiviLogo variant="horizontal" width={200} height={50} />
          </View>
          
          <View style={styles.logoItem}>
            <Text style={styles.logoLabel}>horizontal-white:</Text>
            <SuiviLogo variant="horizontal-white" width={200} height={50} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 40,
    textAlign: 'center',
  },
  logoSection: {
    width: '100%',
    alignItems: 'center',
  },
  logoItem: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
});

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Debug"
        component={DebugScreen}
      />
    </Stack.Navigator>
  );
}
