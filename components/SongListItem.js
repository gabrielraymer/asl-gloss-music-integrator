import { StyleSheet } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import { songStorage } from '@/utils/storage';

export function SongListItem({ song, onPress }) {
  const handleToggleFavorite = async (event) => {
    event.stopPropagation();
    try {
      await songStorage.toggleFavorite(song.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <List.Item
      title={song.title}
      description={`Added: ${new Date(song.dateAdded).toLocaleDateString()}`}
      left={props => <List.Icon {...props} icon="music-note" />}
      right={props => (
        <IconButton
          {...props}
          icon={song.isFavorite ? 'heart' : 'heart-outline'}
          iconColor={song.isFavorite ? '#f44336' : undefined}
          onPress={handleToggleFavorite}
        />
      )}
      onPress={onPress}
      style={styles.item}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
  },
});