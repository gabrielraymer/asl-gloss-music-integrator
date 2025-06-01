import AsyncStorage from '@react-native-async-storage/async-storage';

const SONGS_KEY = '@asl_songs';

interface Song {
  id: string;
  title: string;
  glossFile: string;
  glossData: string[][];
  sheetMusicFile?: string;
  isFavorite?: boolean;
  dateAdded: string;
  lastPlayed?: string;
}

export const songStorage = {
  /**
   * Save a song to storage
   */
  async addSong(song: Song): Promise<void> {
    try {
      // Get existing songs
      const existingSongsJson = await AsyncStorage.getItem(SONGS_KEY);
      const existingSongs: Song[] = existingSongsJson 
        ? JSON.parse(existingSongsJson) 
        : [];
      
      // Add new song
      const updatedSongs = [...existingSongs, song];
      
      // Save back to storage
      await AsyncStorage.setItem(SONGS_KEY, JSON.stringify(updatedSongs));
    } catch (error) {
      console.error('Error saving song:', error);
      throw error;
    }
  },
  
  /**
   * Get all songs
   */
  async getAllSongs(): Promise<Song[]> {
    try {
      const songsJson = await AsyncStorage.getItem(SONGS_KEY);
      return songsJson ? JSON.parse(songsJson) : [];
    } catch (error) {
      console.error('Error getting songs:', error);
      return [];
    }
  },
  
  /**
   * Get recent songs (last 5)
   */
  async getRecentSongs(limit = 5): Promise<Song[]> {
    try {
      const allSongs = await this.getAllSongs();
      return allSongs
        .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent songs:', error);
      return [];
    }
  },
  
  /**
   * Get a song by ID
   */
  async getSongById(id: string): Promise<Song | null> {
    try {
      const allSongs = await this.getAllSongs();
      return allSongs.find(song => song.id === id) || null;
    } catch (error) {
      console.error('Error getting song by ID:', error);
      return null;
    }
  },
  
  /**
   * Update a song
   */
  async updateSong(updatedSong: Song): Promise<void> {
    try {
      const allSongs = await this.getAllSongs();
      const updatedSongs = allSongs.map(song => 
        song.id === updatedSong.id ? updatedSong : song
      );
      await AsyncStorage.setItem(SONGS_KEY, JSON.stringify(updatedSongs));
    } catch (error) {
      console.error('Error updating song:', error);
      throw error;
    }
  },
  
  /**
   * Delete a song
   */
  async deleteSong(id: string): Promise<void> {
    try {
      const allSongs = await this.getAllSongs();
      const updatedSongs = allSongs.filter(song => song.id !== id);
      await AsyncStorage.setItem(SONGS_KEY, JSON.stringify(updatedSongs));
    } catch (error) {
      console.error('Error deleting song:', error);
      throw error;
    }
  },
  
  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<void> {
    try {
      const song = await this.getSongById(id);
      if (song) {
        song.isFavorite = !song.isFavorite;
        await this.updateSong(song);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },
  
  /**
   * Update last played time
   */
  async updateLastPlayed(id: string): Promise<void> {
    try {
      const song = await this.getSongById(id);
      if (song) {
        song.lastPlayed = new Date().toISOString();
        await this.updateSong(song);
      }
    } catch (error) {
      console.error('Error updating last played:', error);
      throw error;
    }
  }
};