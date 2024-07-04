import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tiempo-espera-modal',
  templateUrl: './tiempo-espera-modal.component.html',
  styleUrls: ['./tiempo-espera-modal.component.scss'],
})
export class TiempoEsperaModalPage {
  @Input() pedidoId?: string;

  tiempoEspera?: number;

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  aceptarPedido() {
    if (this.tiempoEspera) {
      this.modalController.dismiss({ tiempoEspera: this.tiempoEspera });
    }
  }
}
