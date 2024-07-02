import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos-por-confirmar-mozo',
  templateUrl: './pedidos-por-confirmar-mozo.page.html',
  styleUrls: ['./pedidos-por-confirmar-mozo.page.scss'],
})
export class PedidosPorConfirmarMozoPage implements OnInit {

  pedidos?: any[];

  constructor(private database: DatabaseService) { }

  ngOnInit() {
    this.cargarPedidosPorConfirmar();
  }

  cargarPedidosPorConfirmar() {
    this.database.obtenerPedidosParaElMozo(['pendiente', 'realizando', 'listo'])?.subscribe((pedidos) => {
      if (pedidos) {
        this.pedidos = pedidos.map(pedido => {
          const data: any = pedido.payload.doc.data(); // asegúrate de que data sea de tipo any
          const id = pedido.payload.doc.id;
          return { id, ...data };
        });
        console.log(this.pedidos);
      }
    });
  }

  confirmarPedido(idPedido: string) {
    this.database.actualizar2('pedidos', { confirmacionMozo: true }, idPedido)
      .then(() => {
        Swal.fire({
          heightAuto: false,
          icon: 'success',
          title: 'Pedido confirmado',
          text: 'El pedido ha sido confirmado correctamente.',
          confirmButtonText: 'OK'
        });
        // Actualizar la lista de pedidos después de confirmar
        this.cargarPedidosPorConfirmar();
      })
      .catch(error => {
        Swal.fire({
          heightAuto: false,
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al confirmar el pedido.',
          confirmButtonText: 'OK'
        });
        console.error('Error al confirmar pedido:', error);
      });
  }

  entregarPedido(idPedido: string) {
    this.database.actualizar2('pedidos', { estado: 'entregado' }, idPedido)
      .then(() => {
        Swal.fire({
          heightAuto: false,
          icon: 'success',
          title: 'Pedido entregado',
          text: 'El pedido ha sido entregado correctamente.',
          confirmButtonText: 'OK'
        });
        // Actualizar la lista de pedidos después de confirmar
        this.cargarPedidosPorConfirmar();
      })
      .catch(error => {
        Swal.fire({
          heightAuto: false,
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al entregar el pedido.',
          confirmButtonText: 'OK'
        });
        console.error('Error al entregar pedido:', error);
      });
  }
}
