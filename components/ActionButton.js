import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

export function ActionButton({ icon, onPress, style }) {
  return (
    <FAB
      style={[styles.fab, style]}
      icon={icon}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: '#6200ee',
  },
});