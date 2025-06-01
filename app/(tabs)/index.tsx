import { StyleSheet, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { songStorage } from '@/utils/storage';
import { parseGlossFile } from '@/utils/glossParser';
import { SongCard } from '@/components/SongCard';
import { ActionButton } from '@/components/ActionButton';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [recentSongs, setRecentSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentSongs();
  }, []);

  const loadRecentSongs = async () => {
    try {
      const songs = await songStorage.getRecentSongs();
      setRecentSongs(songs);
    } catch (error) {
      console.error('Error loading recent songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportSong = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        if (result.name.endsWith('.txt')) {
          // Handle gloss file
          const fileContent = await FileSystem.readAsStringAsync(result.uri);
          const glossData = parseGlossFile(fileContent);
          
          // Save imported song data
          const newSong = {
            id: Date.now().toString(),
            title: result.name.replace('-GLOSS.txt', '').replace(/_/g, ' '),
            glossFile: result.uri,
            glossData,
            dateAdded: new Date().toISOString(),
          };

          await songStorage.addSong(newSong);
          await loadRecentSongs();
        } else {
          // Handle PDF sheet music
          // Request user to select a matching gloss file
          alert('Sheet music detected. Please select the matching gloss file.');
        }
      }
    } catch (error) {
      console.error('Error importing song:', error);
      alert('Failed to import song. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineMedium" style={styles.title}>
          ASL Gloss Music Integrator
        </Text>
        
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title>Welcome!</Title>
            <Paragraph>
              Import your sheet music and ASL gloss files to practice signing songs.
              The app will synchronize your sheet music with the appropriate ASL gloss notations.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={handleImportSong}>
              Import Files
            </Button>
            <Button mode="outlined" onPress={() => router.push('/library')}>
              Browse Library
            </Button>
          </Card.Actions>
        </Card>

        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">Recent Songs</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" />
        ) : recentSongs.length > 0 ? (
          <View style={styles.recentSongs}>
            {recentSongs.map((song) => (
              <SongCard
                key={song.id}
                title={song.title}
                onPress={() => router.push({
                  pathname: '/player',
                  params: { songId: song.id }
                })}
              />
            ))}
          </View>
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Paragraph>No recent songs. Import your first song to get started.</Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
      
      <ActionButton 
        icon="plus" 
        onPress={handleImportSong} 
        style={{
          position: 'absolute',
          bottom: insets.bottom + 70,
          right: 20
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeCard: {
    marginBottom: 20,
    elevation: 2,
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentSongs: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: '#f1f3f5',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loader: {
    marginTop: 40,
  },
});