import { Injectable } from '@angular/core';

import { PodcastTrack } from '../shared/components/podcast-item/podcast-item.component';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favorites: PodcastTrack[] = [];

  isInFavorites(podcastId: number) {
    return this.favorites.findIndex((el) => el.id === podcastId) !== -1;
  }

  addToFavorites(track: PodcastTrack) {
    this.favorites.push(track);
  }

  removeFromFavorites(podcastId: number) {
    this.favorites = this.favorites.filter((el) => el.id !== podcastId);
  }

  getFavorites() {
    return Promise.resolve(this.favorites);
  }
}
