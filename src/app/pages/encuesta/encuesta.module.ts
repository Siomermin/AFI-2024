import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EncuestaPageRoutingModule } from './encuesta-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EncuestaPage } from './encuesta.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [EncuestaPage]
})
export class EncuestaPageModule {}
