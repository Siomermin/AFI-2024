import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';

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
        console.log('Pedido confirmado correctamente.');
        // Actualizar la lista de pedidos después de confirmar
        this.cargarPedidosPorConfirmar();
      })
      .catch(error => {
        console.error('Error al confirmar pedido:', error);
      });
  }

  entregarPedido(idPedido: string) {
    this.database.actualizar2('pedidos', { estado: 'entregado' }, idPedido)
      .then(() => {
        console.log('Pedido entregado correctamente.');
        // Actualizar la lista de pedidos después de confirmar
        this.cargarPedidosPorConfirmar();
      })
      .catch(error => {
        console.error('Error al entregar pedido:', error);
      });
  }

}
