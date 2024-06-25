import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrMesaPage } from './qr-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: QrMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrMesaPageRoutingModule {}
