import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionClientesPage } from './gestion-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: GestionClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionClientesPageRoutingModule {}
