import { WebPlugin } from '@capacitor/core';
import { Howl } from 'howler';

import { PodcastTrack } from '../app/shared/components/podcast-item/podcast-item.component';

export interface MusicPlayer {
  start(data: { url: string; id: any }): Promise<void>;
  pause(): Promise<void>;
  seek(data: { value: number }): Promise<void>;
}

export class MusicPlayerWeb extends WebPlugin implements MusicPlayer {
  private player: Howl = null;
  private activeId: any = null;

  constructor() {
    super({
      name: 'MusicPlayer',
      platforms: ['web'],
    });
  }

  async start(data: {
    url: string;
    id: any;
    track?: PodcastTrack;
  }): Promise<void> {
    this.setupMediaSession(data.track);
    return new Promise((resolve, reject) => {
      if (!data?.url) {
        reject('Property url must be defined');
      }

      if (this.player && !this.player.playing() && this.activeId === data.id) {
        this.player.play();
        return resolve();
      }

      this.player?.unload();

      this.activeId = data.id;

      let src = data.url;

      if ((data.url as any) instanceof Blob) {
        src = URL.createObjectURL(data.url);
      }

      this.player = new Howl({
        src,
        html5: true,
        format: ['mp3'],
        onplay: () => {
          console.log('onplay');
          this.updateProgress();
        },
        onload: () => {
          console.log('loaded');
          resolve();
        },
        onloaderror: (e) => console.error(e),
        onplayerror: (e) => console.error(e),
      });
      this.player.play();
    });
  }

  async pause(): Promise<void> {
    if (this.player?.playing()) {
      this.player.pause();
    }
  }

  async seek(data: { value: number }): Promise<void> {
    if (!this.player) {
      return;
    }
    const duration = this.player.duration();
    this.player.seek(duration * (data.value / 100));
  }

  private updateProgress() {
    console.log('updateProgress');
    const seek = parseFloat(this.player.seek().toString());
    if (isNaN(seek)) {
      return;
    }
    const progress = (seek / this.player.duration()) * 100;
    this.notifyListeners('progress', { value: progress });
    if (this.player.playing()) {
      setTimeout(() => {
        this.updateProgress();
      }, 1000);
    }
  }

  private setupMediaSession(track: PodcastTrack) {
    if ('mediaSession' in navigator && track) {
      const mediaSession = (navigator as any).mediaSession;
      mediaSession.metadata = new (window as any).MediaMetadata({
        title: track.title,
        artist: track.author.name,
        artwork: [
          {
            src: track.author.image,
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      });
      mediaSession.setActionHandler('play', () => {
        if (!this.player || this.player?.playing()) {
          return;
        }
        this.player.play();
        this.notifyListeners('action', { type: 'play' });
      });
      mediaSession.setActionHandler('pause', () => {
        if (!this.player || !this.player?.playing()) {
          return;
        }
        this.player.pause();
        this.notifyListeners('action', { type: 'pause' });
      });
      // TODO:
      mediaSession.setActionHandler('seekbackward', () => {});
      mediaSession.setActionHandler('seekforward', () => {});
    }
  }
}
