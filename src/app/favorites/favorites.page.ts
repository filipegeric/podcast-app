import { Component } from '@angular/core';

import { PodcastTrack } from '../shared/components/podcast-item/podcast-item.component';
import { FavoritesService } from './favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage {
  isLoading = false;
  podcasts: PodcastTrack[] = [];

  constructor(private favoritesService: FavoritesService) {}

  ionViewWillEnter() {
    this.getFavorites();
  }

  async getFavorites() {
    try {
      this.isLoading = true;
      this.podcasts = await this.favoritesService.getFavorites();
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
