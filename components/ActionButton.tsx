import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { FAB } from 'react-native-paper';

interface ActionButtonProps {
  icon: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ActionButton({ icon, onPress, style }: ActionButtonProps) {
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