import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { PodcastTrack } from '../shared/components/podcast-item/podcast-item.component';
import { StorageService } from '../shared/services/storage.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favorites: PodcastTrack[] = [];

  constructor(
    private storageService: StorageService,
    private platform: Platform
  ) {
    this.platform
      .ready()
      .then(() => this.storageService.get('favorites'))
      .then((value) => (this.favorites = value || []))
      .catch(console.error);
  }

  isInFavorites(podcastId: number) {
    return this.favorites.findIndex((el) => el.id === podcastId) !== -1;
  }

  addToFavorites(track: PodcastTrack) {
    this.favorites.push(track);
    this.save();
  }

  removeFromFavorites(podcastId: number) {
    this.favorites = this.favorites.filter((el) => el.id !== podcastId);
    this.save();
  }

  getFavorites() {
    return this.favorites;
  }

  private save() {
    this.storageService.save('favorites', this.favorites);
  }
}
