import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GestionClientesPageRoutingModule } from './gestion-clientes-routing.module';
import { GestionClientesPage } from './gestion-clientes.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionClientesPageRoutingModule,
    TranslateModule
  ],
  declarations: [GestionClientesPage]
})
export class GestionClientesPageModule {}
