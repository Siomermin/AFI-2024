import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultaMozoPageRoutingModule } from './consulta-mozo-routing.module';

import { ConsultaMozoPage } from './consulta-mozo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaMozoPageRoutingModule
  ],
  declarations: [ConsultaMozoPage]
})
export class ConsultaMozoPageModule {}
