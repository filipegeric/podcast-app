import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';

import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  theme: 'light' | 'dark' = 'light';

  constructor(
    private storageService: StorageService,
    private alertController: AlertController,
    private toastController: ToastController,
    private platform: Platform,
    @Inject(DOCUMENT)
    private document: Document
  ) {
    this.platform
      .ready()
      .then(() => this.storageService.get('theme'))
      .then((theme) => this.setTheme(theme))
      .catch(console.error);
  }

  confirm(message = 'Are you sure?') {
    return new Promise((resolve) => {
      this.alertController
        .create({
          message,
          translucent: true,
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => resolve(false),
            },
            {
              text: 'Yes',
              handler: () => resolve(true),
            },
          ],
        })
        .then((alert) => alert.present());
    });
  }

  showMessage(message: string, type = '') {
    this.toastController
      .create({
        message,
        color: type,
        duration: 3000,
        buttons: [{ icon: 'close', role: 'cancel' }],
      })
      .then((t) => t.present())
      .catch(console.error);
  }

  async setTheme(theme?: 'light' | 'dark') {
    if (!theme) {
      return;
    }
    this.theme = theme;
    this.storageService.save('theme', theme);
    const classList = this.document.body.classList;
    classList.remove('light', 'dark');
    classList.add(theme);
  }

  changeTheme() {
    if (this.theme === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }
}
