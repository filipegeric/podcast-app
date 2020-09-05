import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { MusicPlayer } = Plugins;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  isPlaying = false;
  progress = 0;
  isBusy = false;

  expanded = false;

  constructor() {
    MusicPlayer.addListener('progress', (data: any) => {
      console.log(data);
      if (this.isBusy) {
        return;
      }
      this.progress = data.value;
    });
  }

  async playOrPause() {
    this.isBusy = true;
    if (!this.isPlaying) {
      await MusicPlayer.start({
        url: 'https://itsallwidgets.com/podcast/download/episode-36.mp3',
      });
    } else {
      await MusicPlayer.pause();
    }
    this.isPlaying = !this.isPlaying;
    this.isBusy = false;
  }

  async seek() {
    this.isBusy = true;
    await MusicPlayer.seek({
      value: this.progress,
    });
    this.isBusy = false;
  }
}
