import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  progress = 0;
  isBusy = false;

  expanded = false;

  subscription: Subscription;

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.subscription = this.playerService.progress$.subscribe((value) => {
      console.log(value);
      if (this.isBusy) {
        return;
      }
      this.progress = value;
    });
  }

  get isPlaying() {
    return this.playerService.isPlaying;
  }

  get currentTrack() {
    return this.playerService.currentTrack;
  }

  async playOrPause() {
    this.isBusy = true;
    await this.playerService.playOrPause(this.currentTrack);
    this.isBusy = false;
  }

  async seek(value: any) {
    this.isBusy = true;
    await this.playerService.seek(value);
    this.isBusy = false;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
