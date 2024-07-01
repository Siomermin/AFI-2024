import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrIngresoPageRoutingModule } from './qr-ingreso-routing.module';

import { QrIngresoPage } from './qr-ingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrIngresoPageRoutingModule
  ],
  declarations: [QrIngresoPage]
})
export class QrIngresoPageModule {}
