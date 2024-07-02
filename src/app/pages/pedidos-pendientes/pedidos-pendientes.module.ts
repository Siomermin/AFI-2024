import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosPendientesPageRoutingModule } from './pedidos-pendientes-routing.module';

import { PedidosPendientesPage } from './pedidos-pendientes.page';
import { TiempoEsperaModalPage } from './components/tiempo-espera-modal/tiempo-espera-modal.component';
import { PedidosPorConfirmarMozoPageModule } from '../pedidos-por-confirmar-mozo/pedidos-por-confirmar-mozo.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosPendientesPageRoutingModule,
    PedidosPorConfirmarMozoPageModule
  ],
  declarations: [PedidosPendientesPage, TiempoEsperaModalPage]
})
export class PedidosPendientesPageModule {}
