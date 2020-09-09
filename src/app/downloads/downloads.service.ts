import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

import { environment } from '../../environments/environment';
import { PodcastTrack } from '../shared/components/podcast-item/podcast-item.component';
import { StorageService } from '../shared/services/storage.service';

const { Downloader } = Plugins;

@Injectable({ providedIn: 'root' })
export class DownloadsService {
  downloads: PodcastTrack[] = [];

  constructor(
    private storageService: StorageService,
    private platform: Platform
  ) {
    this.platform
      .ready()
      .then(() => this.storageService.get('downloads'))
      .then((value) => (this.downloads = value || []))
      .catch(console.error);
  }

  isInDownloads(podcastId: number) {
    return this.downloads.findIndex((el) => el.id === podcastId) !== -1;
  }

  async addToDownloads(track: PodcastTrack) {
    const res = await Downloader.download({
      url: `${environment.apiUrl}/podcasts/${track.fileName}`,
      title: track.title,
      description: track.description,
    });
    console.log(res);
    this.downloads.push(track);
    await this.save();
  }

  async removeFromDownloads(track: PodcastTrack) {
    if (!this.isInDownloads(track.id)) {
      return;
    }
    await Downloader.remove({
      url: `${environment.apiUrl}/podcasts/${track.fileName}`,
    });
    this.downloads = this.downloads.filter((el) => el.id !== track.id);
    this.save();
  }

  getDownloads() {
    return Promise.resolve(this.downloads);
  }

  private save() {
    return this.storageService.save('downloads', this.downloads);
  }
}
