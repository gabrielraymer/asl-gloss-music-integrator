import { StyleSheet, View } from 'react-native';
import { Text, List } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text variant="headlineMedium" style={styles.title}>Settings</Text>
      <List.Section style={styles.section}>
        <List.Item
          title="App Version"
          description="1.0.0"
          left={props => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title="Theme"
          description="Light"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 20,
  },
  section: {
    width: '100%',
  },
});