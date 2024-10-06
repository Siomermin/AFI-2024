import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QrMesaPageRoutingModule } from './qr-mesa-routing.module';
import { QrMesaPage } from './qr-mesa.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrMesaPageRoutingModule,
    TranslateModule
  ],
  declarations: [QrMesaPage]
})
export class QrMesaPageModule {}
