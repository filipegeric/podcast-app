import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

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
}
