import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

import { songStorage } from '@/utils/storage';
import { parseGlossFile } from '@/utils/glossParser';

export default function ImportScreen() {
  const router = useRouter();
  const { fileUri, fileName } = useLocalSearchParams();
  
  const [title, setTitle] = useState('');
  const [sheetMusicUri, setSheetMusicUri] = useState<string | null>(null);
  const [sheetMusicName, setSheetMusicName] = useState('');
  const [glossContent, setGlossContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (fileUri && fileName) {
      processGlossFile(fileUri as string);
      
      const namePart = (fileName as string).replace('-GLOSS.txt', '').replace(/_/g, ' ');
      setTitle(namePart);
    }
  }, [fileUri, fileName]);
  
  const processGlossFile = async (uri: string) => {
    try {
      setProcessing(true);
      setError(null);
      const content = await FileSystem.readAsStringAsync(uri as string);
      setGlossContent(content);
    } catch (error) {
      console.error('Error reading gloss file:', error);
      setError('Failed to read gloss file. Please try again.');
    } finally {
      setProcessing(false);
    }
  };
  
  const selectSheetMusic = async () => {
    try {
      setError(null);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
      
      if (result.type === 'success') {
        setSheetMusicUri(result.uri);
        setSheetMusicName(result.name);
      }
    } catch (error) {
      console.error('Error selecting sheet music:', error);
      setError('Failed to select sheet music. Please try again.');
    }
  };
  
  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a title for the song');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const glossData = parseGlossFile(glossContent);
      
      const newSong = {
        id: Date.now().toString(),
        title: title.trim(),
        glossFile: fileUri as string,
        glossData,
        sheetMusicFile: sheetMusicUri,
        dateAdded: new Date().toISOString(),
      };
      
      await songStorage.addSong(newSong);
      
      router.replace({
        pathname: '/player',
        params: { songId: newSong.id }
      });
    } catch (error) {
      console.error('Error saving song:', error);
      setError('Failed to save song. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleLarge" style={styles.header}>Import New Song</Text>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        <TextInput
          label="Song Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        
        <Text variant="titleSmall" style={styles.sectionTitle}>ASL Gloss File</Text>
        <View style={styles.fileInfo}>
          <Text>{fileName}</Text>
        </View>
        
        <Text variant="titleSmall" style={styles.sectionTitle}>Sheet Music (Optional)</Text>
        {sheetMusicUri ? (
          <View style={styles.fileInfo}>
            <Text>{sheetMusicName}</Text>
            <Button onPress={selectSheetMusic} mode="text">Change</Button>
          </View>
        ) : (
          <Button 
            icon="file-pdf-box" 
            mode="outlined" 
            onPress={selectSheetMusic}
            style={styles.fileButton}
          >
            Select Sheet Music PDF
          </Button>
        )}
        
        {processing ? (
          <View style={styles.previewLoading}>
            <ActivityIndicator size="small" />
            <Text style={{ marginTop: 10 }}>Processing Gloss File...</Text>
          </View>
        ) : (
          <View style={styles.preview}>
            <Text variant="titleSmall" style={styles.sectionTitle}>Preview</Text>
            <ScrollView 
              style={styles.glossPreview} 
              contentContainerStyle={styles.glossPreviewContent}
            >
              <Text>{glossContent}</Text>
            </ScrollView>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="outlined" 
          onPress={() => router.back()}
          style={{ flex: 1, marginRight: 10 }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          mode="contained" 
          onPress={handleSave}
          style={{ flex: 1 }}
          loading={loading}
          disabled={loading}
        >
          Save
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    paddingBottom: 80,
  },
  header: {
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#c62828',
  },
  input: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
  },
  fileButton: {
    marginBottom: 20,
  },
  preview: {
    marginTop: 10,
  },
  previewLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  glossPreview: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 200,
    marginTop: 5,
  },
  glossPreviewContent: {
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});