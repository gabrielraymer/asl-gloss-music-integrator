import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Text, IconButton, ProgressBar, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

import { songStorage } from '@/utils/storage';
import { GlossLine } from '@/components/GlossLine';

export default function PlayerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { songId } = useLocalSearchParams();
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  
  const sound = useRef(new Audio.Sound());
  const progressInterval = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const triggerBeatFeedback = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // For web, we could add a visual feedback here if desired
  };

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 0.005;
          
          if (Math.floor(prev * 20) !== Math.floor(newProgress * 20)) {
            triggerBeatFeedback();
          }
          
          const newLineIndex = Math.min(
            Math.floor(newProgress * (song?.glossData?.length || 1)),
            (song?.glossData?.length || 1) - 1
          );
          
          if (newLineIndex !== currentLineIndex) {
            setCurrentLineIndex(newLineIndex);
            
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({
                y: newLineIndex * 80,
                animated: true,
              });
            }
          }
          
          if (newProgress >= 1) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
            setIsPlaying(false);
            return 0;
          }
          
          return newProgress;
        });
      }, 100);
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, song?.glossData?.length, currentLineIndex]);

  useEffect(() => {
    loadSong();
    return () => {
      // Clean up on unmount
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      sound.current.unloadAsync();
    };
  }, [songId]);

  const loadSong = async () => {
    if (!songId) {
      router.replace('/library');
      return;
    }
    
    try {
      setLoading(true);
      const songData = await songStorage.getSongById(songId as string);
      if (!songData) {
        alert('Song not found');
        router.replace('/library');
        return;
      }
      
      setSong(songData);
      
      // For demo purpose, we'll use a built-in sound
      // In a real app, you would load the actual song file
      await sound.current.loadAsync(require('@/assets/sounds/demo-song.mp3'));
      
    } catch (error) {
      console.error('Error loading song:', error);
      alert('Failed to load song');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await sound.current.pauseAsync();
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
      } else {
        await sound.current.playAsync();
      }
      
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const resetPlayback = async () => {
    try {
      setProgress(0);
      setCurrentLineIndex(0);
      await sound.current.stopAsync();
      await sound.current.setPositionAsync(0);
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      
      if (isPlaying) {
        setIsPlaying(false);
      }
      
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  if (loading || !song) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
        <Text variant="titleLarge" style={styles.title}>{song.title}</Text>
        <IconButton
          icon="dots-vertical"
          size={24}
          onPress={() => {}}
        />
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} style={styles.progressBar} />
        <Text style={styles.timestamp}>
          {formatTime(progress * 180)} / 3:00
        </Text>
      </View>

      {/* Music Visualization */}
      <View style={styles.musicVisualization}>
        <Text variant="titleSmall">Sheet Music Visualization</Text>
        {/* This would be replaced with actual sheet music display component */}
        <View style={styles.sheetMusicPlaceholder}>
          <Text>Sheet Music Would Display Here</Text>
          <View 
            style={[
              styles.beatIndicator, 
              { left: `${progress * 100}%` }
            ]} 
          />
        </View>
      </View>

      <View style={styles.divider} />

      {/* ASL Gloss Content */}
      <View style={styles.glossContainer}>
        <Text variant="titleSmall" style={styles.glossTitle}>ASL Gloss Notation</Text>
        
        <ScrollView
          ref={scrollViewRef}
          style={styles.glossContent}
          contentContainerStyle={styles.glossContentInner}
        >
          {song?.glossData?.map((line: string[], index: number) => (
            <GlossLine 
              key={index}
              line={line}
              isActive={index === currentLineIndex}
              progress={index === currentLineIndex ? progress * song.glossData.length % 1 : 0}
            />
          ))}
        </ScrollView>
      </View>

      {/* Playback Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 10 }]}>
        <IconButton
          icon="rewind"
          size={36}
          onPress={resetPlayback}
        />
        <IconButton
          icon={isPlaying ? "pause" : "play"}
          size={56}
          mode="contained"
          onPress={handlePlayPause}
        />
        <IconButton
          icon="fast-forward"
          size={36}
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginRight: 50,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  timestamp: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#666',
  },
  musicVisualization: {
    padding: 20,
    paddingTop: 0,
  },
  sheetMusicPlaceholder: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  beatIndicator: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: 'red',
    top: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
    marginHorizontal: 20,
  },
  glossContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  glossTitle: {
    marginBottom: 10,
  },
  glossContent: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  glossContentInner: {
    padding: 15,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
});