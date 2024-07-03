import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaPageRoutingModule } from './encuesta-routing.module';
import { NgForm } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EncuestaPage } from './encuesta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaPageRoutingModule, ReactiveFormsModule
  ],
  declarations: [EncuestaPage]
})
export class EncuestaPageModule {}
