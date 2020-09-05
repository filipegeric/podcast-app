import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  save(key: string, value: any) {
    return Storage.set({ key, value: JSON.stringify(value) });
  }

  async get(key: string): Promise<any> {
    const v = await Storage.get({ key });
    return JSON.parse(v.value);
  }
}
