import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaMozoPage } from './consulta-mozo.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaMozoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaMozoPageRoutingModule {}
