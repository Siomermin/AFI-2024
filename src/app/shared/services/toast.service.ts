import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

type Position = 'top' | 'middle' | 'bottom';

type Color = 'success' | 'danger' | 'primary' | 'warning';


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastController = inject(ToastController);

  async presentToast(message: string, position: Position, color: Color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: position,
    });

    await toast.present();
  }
}
