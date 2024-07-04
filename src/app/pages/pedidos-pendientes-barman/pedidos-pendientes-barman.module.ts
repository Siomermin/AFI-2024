import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosPendientesBarmanPageRoutingModule } from './pedidos-pendientes-barman-routing.module';

import { PedidosPendientesBarmanPage } from './pedidos-pendientes-barman.page';
import { PedidosPorConfirmarMozoPageModule } from '../pedidos-por-confirmar-mozo/pedidos-por-confirmar-mozo.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosPendientesBarmanPageRoutingModule,
    PedidosPorConfirmarMozoPageModule
  ],
  declarations: [PedidosPendientesBarmanPage]
})
export class PedidosPendientesBarmanPageModule {}
