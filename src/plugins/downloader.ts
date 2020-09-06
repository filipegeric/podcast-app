import { WebPlugin } from '@capacitor/core';
import { openDB } from 'idb';

export interface Downloader {
  download(data: { url: string }): Promise<any>;
}

export class DownloaderWeb extends WebPlugin implements Downloader {
  constructor() {
    super({
      name: 'Downloader',
      platforms: ['web'],
    });
  }

  async download({ url }: { url: string }): Promise<any> {
    const database = await openDB('Downloads', 1, {
      upgrade: (db) => {
        const store = db.createObjectStore('downloads', {
          keyPath: 'id',
          autoIncrement: true,
        });

        store.createIndex('url', 'url');
      },
    });
    const response = await fetch(url);

    if (response.status !== 200) {
      throw new Error('Unable to download file');
    }

    const blob = await response.blob();

    return database.add('downloads', {
      url,
      value: blob,
    });
  }

  async get(url: string) {
    const database = await openDB('Downloads', 1, {
      upgrade: (db) => {
        const store = db.createObjectStore('downloads', {
          keyPath: 'id',
          autoIncrement: true,
        });

        store.createIndex('url', 'url');
      },
    });

    return database.getFromIndex('downloads', 'url', url);
  }
}
