import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosPorConfirmarMozoPageRoutingModule } from './pedidos-por-confirmar-mozo-routing.module';

import { PedidosPorConfirmarMozoPage } from './pedidos-por-confirmar-mozo.page';
import { AgruparProductosPipe } from 'src/app/pipes/agrupar-productos.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosPorConfirmarMozoPageRoutingModule
  ],
  declarations: [PedidosPorConfirmarMozoPage, AgruparProductosPipe],
  exports: [AgruparProductosPipe] // Exporta el pipe
})
export class PedidosPorConfirmarMozoPageModule {}
