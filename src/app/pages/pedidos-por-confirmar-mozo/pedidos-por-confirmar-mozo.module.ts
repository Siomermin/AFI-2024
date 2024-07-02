import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosPorConfirmarMozoPageRoutingModule } from './pedidos-por-confirmar-mozo-routing.module';

import { PedidosPorConfirmarMozoPage } from './pedidos-por-confirmar-mozo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosPorConfirmarMozoPageRoutingModule
  ],
  declarations: [PedidosPorConfirmarMozoPage]
})
export class PedidosPorConfirmarMozoPageModule {}
