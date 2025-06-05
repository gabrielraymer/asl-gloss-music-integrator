import AsyncStorage from '@react-native-async-storage/async-storage';

const SONGS_KEY = '@asl_songs';

export const songStorage = {
  async addSong(song) {
    try {
      const existingSongsJson = await AsyncStorage.getItem(SONGS_KEY);
      const existingSongs = existingSongsJson 
        ? JSON.parse(existingSongsJson) 
        : [];
      
      const updatedSongs = [...existingSongs, song];
      await AsyncStorage.setItem(SONGS_KEY, JSON.stringify(updatedSongs));
    } catch (error) {
      console.error('Error saving song:', error);
      throw error;
    }
  },
  
  async getAllSongs() {
    try {
      const songsJson = await AsyncStorage.getItem(SONGS_KEY);
      return songsJson ? JSON.parse(songsJson) : [];
    } catch (error) {
      console.error('Error getting songs:', error);
      return [];
    }
  },
  
  async getRecentSongs(limit = 5) {
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
  
  async getSongById(id) {
    try {
      const allSongs = await this.getAllSongs();
      return allSongs.find(song => song.id === id) || null;
    } catch (error) {
      console.error('Error getting song by ID:', error);
      return null;
    }
  },
  
  async updateSong(updatedSong) {
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
  
  async deleteSong(id) {
    try {
      const allSongs = await this.getAllSongs();
      const updatedSongs = allSongs.filter(song => song.id !== id);
      await AsyncStorage.setItem(SONGS_KEY, JSON.stringify(updatedSongs));
    } catch (error) {
      console.error('Error deleting song:', error);
      throw error;
    }
  },
  
  async toggleFavorite(id) {
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
  
  async updateLastPlayed(id) {
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