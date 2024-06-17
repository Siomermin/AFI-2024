import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionClientesPageRoutingModule } from './gestion-clientes-routing.module';

import { GestionClientesPage } from './gestion-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionClientesPageRoutingModule
  ],
  declarations: [GestionClientesPage]
})
export class GestionClientesPageModule {}
