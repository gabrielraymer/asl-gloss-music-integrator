import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Music, AlertCircle, FileQuestion } from 'lucide-react-native';

interface EmptyStateProps {
  icon: 'music' | 'alert' | 'file';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  const IconComponent = {
    music: Music,
    alert: AlertCircle,
    file: FileQuestion
  }[icon];

  return (
    <View style={styles.container}>
      <IconComponent size={64} color="#9e9e9e" />
      <Text variant="titleMedium" style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction && (
        <Button mode="contained" style={styles.button} onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#757575',
  },
  button: {
    marginTop: 10,
  },
});