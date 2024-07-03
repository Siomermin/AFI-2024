import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import Swal from 'sweetalert2';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-pedidos-pendientes',
  templateUrl: './pedidos-pendientes.page.html',
  styleUrls: ['./pedidos-pendientes.page.scss'],
})
export class PedidosPendientesPage implements OnInit {
  pedidos?: any[];

  constructor(
    private database: DatabaseService,
    private notificationService: NotificationService
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
    const dataPedido = {
      estado: 'realizando',
    };
    this.database
      .actualizar2('pedidos', dataPedido, pedidoId)
      .then(() => {
        Swal.fire({
          heightAuto: false,
          icon: 'success',
          title: 'Pedido aceptado',
          text: 'El pedido ha sido aceptado correctamente.',
          confirmButtonText: 'OK',
        });
        this.cargarPedidosPendientes();
      })
      .catch((error) => {
        Swal.fire({
          heightAuto: false,
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al aceptar el pedido.',
          confirmButtonText: 'OK'
        });
        console.error('Error al aceptar pedido:', error);
      });
  }

  terminarPedido(pedidoId: string) {
    this.database
      .actualizar2('pedidos', { estado: 'listo' }, pedidoId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Pedido terminado',
          text: 'El pedido ha sido terminado correctamente.',
          confirmButtonText: 'OK',
          heightAuto: false
        });
        this.cargarPedidosPendientes();

        this.notificationService.sendNotificationToRole(
          'Hay un nuevo pedido listo!',
          'Esta listo para ser entregado a la mesa...',
          'Mozo'
        ).subscribe(
          response => console.log('Notificación a Mozo enviada con éxito', response),
          error => console.error('Error al enviar notificación a Mozo', error)
        );
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al terminar el pedido.',
          confirmButtonText: 'OK',
          heightAuto: false
        });
        console.error('Error al terminar pedido:', error);
      });
  }
}
