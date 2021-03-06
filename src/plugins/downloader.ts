import { WebPlugin } from '@capacitor/core';
import { openDB } from 'idb';

export interface DownloadOptions {
  url: string;
  title?: string;
  description?: string;
}
export interface Downloader {
  download(data: {
    url: string;
    title?: string;
    description?: string;
  }): Promise<any>;
  get(data: { url: string }): Promise<{ url: string; value: any }>;
  remove(data: { url: string }): Promise<void>;
}

export class DownloaderWeb extends WebPlugin implements Downloader {
  constructor() {
    super({
      name: 'Downloader',
      platforms: ['web'],
    });
  }

  async download({ url }: DownloadOptions): Promise<any> {
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

  async get({ url }: { url: string }) {
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

  async remove({ url }: { url: string }): Promise<void> {
    const database = await openDB('Downloads', 1, {
      upgrade: (db) => {
        const store = db.createObjectStore('downloads', {
          keyPath: 'id',
          autoIncrement: true,
        });

        store.createIndex('url', 'url');
      },
    });

    const key = await database.getKeyFromIndex('downloads', 'url', url);
    if (key) {
      await database.delete('downloads', key);
    }
  }
}
