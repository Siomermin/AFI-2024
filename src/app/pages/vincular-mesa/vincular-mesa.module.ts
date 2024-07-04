import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VincularMesaPageRoutingModule } from './vincular-mesa-routing.module';

import { VincularMesaPage } from './vincular-mesa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VincularMesaPageRoutingModule
  ],
  declarations: [VincularMesaPage]
})
export class VincularMesaPageModule {}
