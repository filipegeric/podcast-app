import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { DownloadsService } from '../../../downloads/downloads.service';
import { FavoritesService } from '../../../favorites/favorites.service';
import { Tag } from '../../services/api.service';
import { PlayerService } from '../../services/player.service';

export interface Author {
  id: number;
  name: string;
  image: string;
}

export interface PodcastTrack {
  id: number;
  title: string;
  description: string;
  author: Author;
  duration: number; // in seconds
  createdAt: string;
  fileName: string;
  tags?: Tag[];
}

export interface ExtendedPodcastTrack extends PodcastTrack {
  downloaded?: boolean;
  liked?: boolean;
}

@Component({
  selector: 'app-podcast-item',
  templateUrl: './podcast-item.component.html',
  styleUrls: ['./podcast-item.component.scss'],
})
export class PodcastItemComponent {
  @Input()
  track: PodcastTrack;

  @Input()
  details = false;

  isDownloading = false;
  isLoading = false;

  constructor(
    private favoritesService: FavoritesService,
    private downloadsService: DownloadsService,
    private playerService: PlayerService,
    private modalController: ModalController
  ) {}

  openDetails() {
    if (this.details) {
      return;
    }
    this.modalController
      .create({
        component: PodcastItemComponent,
        componentProps: {
          track: this.track,
          details: true,
        },
        swipeToClose: true,
        cssClass: 'custom-modal',
        mode: 'ios',
      })
      .then((m) => m.present())
      .catch(console.error);
  }

  addToFavorites() {
    if (this.liked) {
      this.favoritesService.removeFromFavorites(this.track.id);
    } else {
      this.favoritesService.addToFavorites(this.track);
    }
  }

  async download() {
    try {
      if (this.downloaded) {
        return;
      }
      this.isDownloading = true;
      await this.downloadsService.addToDownloads(this.track);
    } catch (error) {
      console.error(error);
    } finally {
      this.isDownloading = false;
    }
  }

  get downloaded() {
    return this.downloadsService.isInDownloads(this.track?.id);
  }

  get liked() {
    return this.favoritesService.isInFavorites(this.track?.id);
  }

  get isPlaying() {
    return (
      this.playerService.isPlaying &&
      this.track?.id === this.playerService.currentTrack?.id
    );
  }

  async play() {
    this.isLoading = true;
    await this.playerService.playOrPause(this.track);
    this.isLoading = false;
  }
}
