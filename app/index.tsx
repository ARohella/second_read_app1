import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../src/store/AppContext';
import { Colors } from '../src/lib/constants';
import * as SecureStorage from '../src/services/secure-storage';

export default function Index() {
  const { isOnboarded, isLoading } = useApp();

  useEffect(() => {
    // Clear all data for fresh demo each time
    SecureStorage.clearAllSecureData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (isOnboarded) {
        router.replace('/(main)');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isLoading, isOnboarded]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
