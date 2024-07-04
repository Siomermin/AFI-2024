import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaPageRoutingModule } from './alta-routing.module';
import { ReactiveFormsModule } from '@angular/forms';  // Añade esta línea
import { AltaPage } from './alta.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaPageRoutingModule, ReactiveFormsModule
  ],
  declarations: [AltaPage]
})
export class AltaPageModule {}
