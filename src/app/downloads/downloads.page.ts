import { Component } from '@angular/core';

import { PodcastTrack } from '../shared/components/podcast-item/podcast-item.component';
import { DownloadsService } from './downloads.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.page.html',
  styleUrls: ['./downloads.page.scss'],
})
export class DownloadsPage {
  isLoading = false;
  podcasts: PodcastTrack[] = [];

  constructor(private downloadsService: DownloadsService) {}

  ionViewWillEnter() {
    this.getDownloads();
  }

  async getDownloads() {
    try {
      this.isLoading = true;
      this.podcasts = await this.downloadsService.getDownloads();
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
