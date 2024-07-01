import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosPendientesPage } from './pedidos-pendientes.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosPendientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosPendientesPageRoutingModule {}
