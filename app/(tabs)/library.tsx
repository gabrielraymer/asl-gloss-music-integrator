import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, Searchbar, Chip, List, Divider, ActivityIndicator, FAB } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

import { songStorage } from '@/utils/storage';
import { SongListItem } from '@/components/SongListItem';
import { EmptyState } from '@/components/EmptyState';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const allSongs = await songStorage.getAllSongs();
      setSongs(allSongs);
      setFilteredSongs(allSongs);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      filterSongs(selectedFilter, []);
      return;
    }
    
    const searchResults = songs.filter(song => 
      song.title.toLowerCase().includes(query.toLowerCase())
    );
    
    filterSongs(selectedFilter, searchResults);
  };

  const filterSongs = (filter: string, searchResults: any[] = []) => {
    setSelectedFilter(filter);
    const songsToFilter = searchResults.length > 0 ? searchResults : songs;

    switch (filter) {
      case 'recent':
        setFilteredSongs(
          [...songsToFilter].sort((a, b) => 
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          )
        );
        break;
      case 'favorite':
        setFilteredSongs(songsToFilter.filter(song => song.isFavorite));
        break;
      default:
        setFilteredSongs(songsToFilter);
    }
  };

  const handleImportSong = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success' && result.name.toLowerCase().includes('gloss')) {
        router.push({
          pathname: '/(modals)/import',
          params: { fileUri: result.uri, fileName: result.name }
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Library</Text>
        <Searchbar
          placeholder="Search songs"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <View style={styles.filtersContainer}>
          <Chip
            selected={selectedFilter === 'all'}
            onPress={() => filterSongs('all')}
            style={styles.filterChip}
          >
            All Songs
          </Chip>
          <Chip
            selected={selectedFilter === 'recent'}
            onPress={() => filterSongs('recent')}
            style={styles.filterChip}
          >
            Recent
          </Chip>
          <Chip
            selected={selectedFilter === 'favorite'}
            onPress={() => filterSongs('favorite')}
            style={styles.filterChip}
          >
            Favorites
          </Chip>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : filteredSongs.length > 0 ? (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongListItem
              song={item}
              onPress={() => router.push({
                pathname: '/player',
                params: { songId: item.id }
              })}
            />
          )}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          icon="music-note"
          title="No songs found"
          description={
            searchQuery 
              ? "No songs match your search." 
              : "Import your first song to get started."
          }
          actionLabel="Import Song"
          onAction={handleImportSong}
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + 70 }]}
        onPress={handleImportSong}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
  },
  searchbar: {
    marginBottom: 15,
    elevation: 1,
    borderRadius: 10,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterChip: {
    marginRight: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#6200ee',
  },
});