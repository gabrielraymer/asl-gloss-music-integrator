import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to Expo Router
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        This is a minimal setup with tabs navigation
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});