
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SessionsScreen from './components/session/sessions-screen/sessions-screen';
import SessionScreen from './components/session/session-screen/session-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const queryClient = new QueryClient();

type RootStackParamList = {
  Sessions: undefined;
  Session: { sessionId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const baseUrl = 'http://10.0.2.2:8000';

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Sessions">
            {({ navigation }) => (
              <SessionsScreen
                onOpenSession={sessionId =>
                  navigation.navigate('Session', { sessionId })
                }
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="Session">
            {({ navigation, route }) => (
              <SessionScreen
                baseUrl={baseUrl}
                sessionId={route.params.sessionId}
                onBack={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
