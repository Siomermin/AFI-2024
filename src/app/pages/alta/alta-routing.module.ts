import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaPage } from './alta.page';

const routes: Routes = [
  {
    path: '',
    component: AltaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaPageRoutingModule {}
