import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import Swal from 'sweetalert2';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-pedidos-pendientes-barman',
  templateUrl: './pedidos-pendientes-barman.page.html',
  styleUrls: ['./pedidos-pendientes-barman.page.scss'],
})
export class PedidosPendientesBarmanPage implements OnInit {
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
          this.pedidos = pedidos
            .map((pedido) => {
              const data: any = pedido.payload.doc.data();
              const id = pedido.payload.doc.id;
              return { id, ...data };
            })
            .filter((pedido) => pedido.bebidas && pedido.bebidas.length > 0); // Filtrar pedidos con al menos una bebida
          console.log(this.pedidos);
        }
      });
  }

  async aceptarPedido(pedidoId: string) {
    const dataPedido = {
      estado: 'realizando',
      confirmacionBartender: true  // Actualiza la confirmación del bartender
    };

    this.database.actualizar2('pedidos', dataPedido, pedidoId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Pedido aceptado',
          text: 'El pedido ha sido aceptado correctamente.',
          confirmButtonText: 'OK',
          heightAuto: false
        });
        this.cargarPedidosPendientes();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al aceptar el pedido.',
          confirmButtonText: 'OK'
        });
        console.error('Error al aceptar pedido:', error);
      });
  }

  terminarPedido(pedidoId: string) {
    // Actualiza la variable terminoBartender a true para indicar que el bartender ha terminado
    const dataPedido = {
      terminoBartender: true,
    };

    this.database.actualizar2('pedidos', dataPedido, pedidoId)
      .then(() => {
        this.actualizarEstadoGlobal(pedidoId); // Verifica si ambos han confirmado y terminado para actualizar el estado a 'listo'
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar el estado del pedido por el bartender.',
          confirmButtonText: 'OK',
          heightAuto: false
        });
        console.error('Error al terminar pedido por el bartender:', error);
      });
  }

  actualizarEstadoGlobal(pedidoId: string) {
    // Verifica si todos los involucrados (cocinero y bartender) han confirmado y terminado para cambiar el estado global
    this.database.obtenerDocumento('pedidos', pedidoId)
      .subscribe((pedido: any) => {
        console.log(pedido);
        if (pedido) {
          const confirmacionCocinero = pedido.confirmacionCocinero || false;
          const confirmacionBartender = pedido.confirmacionBartender || false;
          const terminoCocinero = pedido.terminoCocinero || false;
          const terminoBartender = pedido.terminoBartender || false;

          // Verificar si ambos han confirmado y terminado
          if (confirmacionCocinero && confirmacionBartender && terminoCocinero && terminoBartender) {
            // Ambos han confirmado y terminado, actualizar el estado a 'listo'
            this.database.actualizar2('pedidos', { estado: 'listo' }, pedidoId)
              .then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Pedido listo',
                  text: 'El pedido está listo para ser entregado.',
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
                  text: 'Hubo un error al marcar el pedido como listo.',
                  confirmButtonText: 'OK',
                  heightAuto: false
                });
                console.error('Error al marcar pedido como listo:', error);
              });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Pedido terminado por el bartender',
              text: 'El bartender ha finalizado su pedido.',
              confirmButtonText: 'OK',
              heightAuto: false
            });
          }
        }
      });
  }
}
