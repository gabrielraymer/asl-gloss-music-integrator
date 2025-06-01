import { StyleSheet } from 'react-native';
import { Card, Text, Icon } from 'react-native-paper';

interface SongCardProps {
  title: string;
  onPress: () => void;
}

export function SongCard({ title, onPress }: SongCardProps) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        <Icon source="music-note" size={24} color="#6200ee" />
        <Text variant="titleMedium" style={styles.title}>{title}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 12,
  },
});