import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaEsperaPageRoutingModule } from './lista-espera-routing.module';
import { ListaEsperaPage } from './lista-espera.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaEsperaPageRoutingModule,
    TranslateModule
  ],
  declarations: [ListaEsperaPage]
})
export class ListaEsperaPageModule {}
