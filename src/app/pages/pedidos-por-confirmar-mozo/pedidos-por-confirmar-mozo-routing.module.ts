import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosPorConfirmarMozoPage } from './pedidos-por-confirmar-mozo.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosPorConfirmarMozoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosPorConfirmarMozoPageRoutingModule {}
