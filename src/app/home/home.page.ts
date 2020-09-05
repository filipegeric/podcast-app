import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';

import { PodcastTrack } from '../shared/components/podcast-item/podcast-item.component';
import { ApiService, Tag } from '../shared/services/api.service';

const { MusicPlayer } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  isLoading = false;
  podcasts: PodcastTrack[] = [];
  tags: Tag[] = [];
  searchTerm = '';

  constructor(private api: ApiService) {}

  ionViewWillEnter() {
    this.fetchPodcasts();
  }

  search({ detail: { value } }: CustomEvent<{ value: string }>) {
    this.searchTerm = value;
    this.fetchPodcasts();
  }

  async fetchPodcasts() {
    try {
      this.isLoading = true;
      this.podcasts = await this.api.getPodcasts(this.searchTerm);
      this.tags = await this.api.getTags();
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
