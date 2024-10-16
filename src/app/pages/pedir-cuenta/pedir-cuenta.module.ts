import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedirCuentaPageRoutingModule } from './pedir-cuenta-routing.module';

import { PedirCuentaPage } from './pedir-cuenta.page';
import { MemoTestComponent } from 'src/app/components/memo-test/memo-test.component';
@NgModule({
  declarations: [PedirCuentaPage, MemoTestComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedirCuentaPageRoutingModule
  ],
 
  
})
export class PedirCuentaPageModule {}
