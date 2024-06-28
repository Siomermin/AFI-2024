import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrIngresoPage } from './qr-ingreso.page';

const routes: Routes = [
  {
    path: '',
    component: QrIngresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrIngresoPageRoutingModule {}
