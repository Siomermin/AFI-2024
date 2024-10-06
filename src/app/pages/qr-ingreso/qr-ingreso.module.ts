import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QrIngresoPageRoutingModule } from './qr-ingreso-routing.module';
import { QrIngresoPage } from './qr-ingreso.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrIngresoPageRoutingModule,
    TranslateModule
  ],
  declarations: [QrIngresoPage]
})
export class QrIngresoPageModule {}
