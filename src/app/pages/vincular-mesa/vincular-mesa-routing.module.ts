import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VincularMesaPage } from './vincular-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: VincularMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VincularMesaPageRoutingModule {}
