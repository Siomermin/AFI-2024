import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosPendientesBarmanPage } from './pedidos-pendientes-barman.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosPendientesBarmanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosPendientesBarmanPageRoutingModule {}
