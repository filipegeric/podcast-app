import { Component, Input } from '@angular/core';

import { DownloadsService } from '../../../downloads/downloads.service';
import { FavoritesService } from '../../../favorites/favorites.service';
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

  constructor(
    private favoritesService: FavoritesService,
    private downloadsService: DownloadsService,
    private playerService: PlayerService
  ) {}

  addToFavorites() {
    if (this.liked) {
      this.favoritesService.removeFromFavorites(this.track.id);
    } else {
      this.favoritesService.addToFavorites(this.track);
    }
  }

  download() {
    if (this.downloaded) {
      return;
    }
    this.downloadsService.addToDownloads(this.track);
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

  play() {
    this.playerService.playOrPause(this.track);
  }
}
