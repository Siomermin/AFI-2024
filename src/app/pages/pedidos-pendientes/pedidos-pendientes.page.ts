import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { ModalController } from '@ionic/angular';
import { TiempoEsperaModalPage } from './components/tiempo-espera-modal/tiempo-espera-modal.component';

@Component({
  selector: 'app-pedidos-pendientes',
  templateUrl: './pedidos-pendientes.page.html',
  styleUrls: ['./pedidos-pendientes.page.scss'],
})
export class PedidosPendientesPage implements OnInit {
  pedidos?: any[];

  constructor(
    private database: DatabaseService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.cargarPedidosPendientes();
  }

  cargarPedidosPendientes() {
    this.database
      .obtenerPedidosPorEstados(['pendiente', 'realizando'], true)
      ?.subscribe((pedidos) => {
        if (pedidos) {
          this.pedidos = pedidos.map((pedido) => {
            const data: any = pedido.payload.doc.data();
            const id = pedido.payload.doc.id;
            return { id, ...data }; // Agregar un estado inicial
          });
          console.log(this.pedidos);
        }
      });
  }

  async aceptarPedido(pedidoId: string) {
    // const modal = await this.modalController.create({
    //   component: TiempoEsperaModalPage,
    //   componentProps: {
    //     pedidoId: pedidoId
    //   }
    // });

    // modal.onDidDismiss().then((data) => {
    //   if (data.data) {
    //     const tiempoEspera = data.data.tiempoEspera;
    //     const dataPedido = {
    //       estado: 'realizando',
    //       tiempoMinimoEspera: parseInt(tiempoEspera)
    //     };

    const dataPedido = {
      estado: 'realizando',
    };
    this.database
      .actualizar2('pedidos', dataPedido, pedidoId)
      .then(() => {
        console.log('Pedido aceptado correctamente.');
        this.cargarPedidosPendientes();
      })
      .catch((error) => {
        console.error('Error al aceptar pedido:', error);
      });
  }
  // });

  // return await modal.present();
  //}

  terminarPedido(pedidoId: string) {
    this.database
      .actualizar2('pedidos', { estado: 'listo' }, pedidoId)
      .then(() => {
        console.log('Pedido aceptado correctamente.');
        this.cargarPedidosPendientes();
      })
      .catch((error) => {
        console.error('Error al aceptar pedido:', error);
      });

    // Actualizar la lista de pedidos después de terminar
    this.cargarPedidosPendientes();
  }
}
