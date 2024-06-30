import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedirCuentaPage } from './pedir-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: PedirCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedirCuentaPageRoutingModule {}
