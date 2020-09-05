import { Injectable } from '@angular/core';

import { PodcastTrack } from '../shared/components/podcast-item/podcast-item.component';

@Injectable({ providedIn: 'root' })
export class DownloadsService {
  downloads: PodcastTrack[] = [];

  isInDownloads(podcastId: number) {
    return this.downloads.findIndex((el) => el.id === podcastId) !== -1;
  }

  addToDownloads(track: PodcastTrack) {
    this.downloads.push(track);
  }

  removeFromDownloads(podcastId: number) {
    this.downloads = this.downloads.filter((el) => el.id !== podcastId);
  }

  getDownloads() {
    return Promise.resolve(this.downloads);
  }
}
