import { WebPlugin } from '@capacitor/core';
import { Howl } from 'howler';

export interface MusicPlayer {
  start(data: { url: string }): Promise<void>;
  pause(): Promise<void>;
  seek(data: { value: number }): Promise<void>;
}

export class MusicPlayerWeb extends WebPlugin implements MusicPlayer {
  private player: Howl = null;
  private activeUrl: string = null;

  constructor() {
    super({
      name: 'MusicPlayer',
      platforms: ['web'],
    });
  }

  async start(data: { url: string }): Promise<void> {
    if (!data?.url) {
      throw new Error('Property url must be defined');
    }

    if (this.player && !this.player.playing() && this.activeUrl === data.url) {
      this.player.play();
      return;
    }

    this.player?.unload();

    this.activeUrl = data.url;

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
      },
      onloaderror: (e) => console.error(e),
      onplayerror: (e) => console.error(e),
    });
    this.player.play();
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
}
