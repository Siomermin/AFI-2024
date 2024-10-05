import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PedidosPendientesPageRoutingModule } from './pedidos-pendientes-routing.module';
import { PedidosPendientesPage } from './pedidos-pendientes.page';
import { PedidosPorConfirmarMozoPageModule } from '../pedidos-por-confirmar-mozo/pedidos-por-confirmar-mozo.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosPendientesPageRoutingModule,
    PedidosPorConfirmarMozoPageModule,
    TranslateModule
  ],
  declarations: [PedidosPendientesPage]
})
export class PedidosPendientesPageModule {}
