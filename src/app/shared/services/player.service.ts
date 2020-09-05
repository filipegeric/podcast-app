import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MusicPlayer } from '../../../plugins/music-player';
import { PodcastTrack } from '../components/podcast-item/podcast-item.component';

const { MusicPlayer } = Plugins;

@Injectable({ providedIn: 'root' })
export class PlayerService {
  isPlaying = false;
  currentTrack: PodcastTrack = null;

  progress$ = new Subject<number>();

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      MusicPlayer.addListener('progress', (data: any) => {
        this.progress$.next(data.value);
      });
    });
  }

  private get apiUrl() {
    return environment.apiUrl;
  }

  async playOrPause(track: PodcastTrack) {
    if (!this.isPlaying) {
      await MusicPlayer.start({
        url: `${this.apiUrl}/podcasts/${track.fileName}`,
      });
      this.isPlaying = true;
    } else {
      this.isPlaying = false;
      if (track.id === this.currentTrack?.id) {
        await MusicPlayer.pause();
      } else {
        await MusicPlayer.start({
          url: `${this.apiUrl}/podcasts/${track.fileName}`,
        });
        this.isPlaying = true;
      }
    }
    this.currentTrack = track;
  }

  async seek(value: number) {
    await MusicPlayer.seek({ value });
  }
}
