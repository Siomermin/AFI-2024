import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConsultaMozoPageRoutingModule } from './consulta-mozo-routing.module';
import { ConsultaMozoPage } from './consulta-mozo.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaMozoPageRoutingModule,
    TranslateModule
  ],
  declarations: [ConsultaMozoPage]
})
export class ConsultaMozoPageModule {}
