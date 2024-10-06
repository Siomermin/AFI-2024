import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QrPropinaPageRoutingModule } from './qr-propina-routing.module';
import { QrPropinaPage } from './qr-propina.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrPropinaPageRoutingModule,
    TranslateModule
  ],
  declarations: [QrPropinaPage]
})
export class QrPropinaPageModule {}
