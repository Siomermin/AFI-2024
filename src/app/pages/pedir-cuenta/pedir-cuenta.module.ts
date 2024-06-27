import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedirCuentaPageRoutingModule } from './pedir-cuenta-routing.module';

import { PedirCuentaPage } from './pedir-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedirCuentaPageRoutingModule
  ],
  declarations: [PedirCuentaPage]
})
export class PedirCuentaPageModule {}
