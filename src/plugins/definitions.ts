import { Downloader } from './downloader';
import { MusicPlayer } from './music-player';

declare module '@capacitor/core' {
  interface PluginRegistry {
    MusicPlayer: MusicPlayer;
    Downloader: Downloader;
  }
}
