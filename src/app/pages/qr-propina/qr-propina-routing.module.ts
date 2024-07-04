import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrPropinaPage } from './qr-propina.page';

const routes: Routes = [
  {
    path: '',
    component: QrPropinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrPropinaPageRoutingModule {}
