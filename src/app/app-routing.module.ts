import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'auth',
    loadChildren: () =>  import('./auth/auth.module').then( m => m.AuthModule )
  },
  {
    path: 'alta',
    loadChildren: () => import('./pages/alta/alta.module').then( m => m.AltaPageModule)
  },
  {
    path: 'alta-mesa',
    loadChildren: () => import('./pages/alta-mesa/alta-mesa.module').then( m => m.AltaMesaPageModule)
  },
  {
    path: 'home',
    loadChildren: () =>  import('./home/home.module').then( m => m.HomePageModule )
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'gestion-clientes',
    loadChildren: () => import('./pages/gestion-clientes/gestion-clientes.module').then( m => m.GestionClientesPageModule)
  },
  {
    path: 'consulta-mozo',
    loadChildren: () => import('./pages/consulta-mozo/consulta-mozo.module').then( m => m.ConsultaMozoPageModule)
  },
  {
    path: 'vincular-mesa',//NO SE USA
    loadChildren: () => import('./pages/vincular-mesa/vincular-mesa.module').then( m => m.VincularMesaPageModule)
  },
  {
    path: 'qr-mesa',
    loadChildren: () => import('./pages/qr-mesa/qr-mesa.module').then( m => m.QrMesaPageModule)
  },
  {
    path: 'qr-propina',
    loadChildren: () => import('./pages/qr-propina/qr-propina.module').then( m => m.QrPropinaPageModule)
  },
  {
    path: 'qr-ingreso',
    loadChildren: () => import('./pages/qr-ingreso/qr-ingreso.module').then( m => m.QrIngresoPageModule)
  },
  {
    path: 'encuesta',
    loadChildren: () => import('./pages/encuesta/encuesta.module').then( m => m.EncuestaPageModule)
  },
  {
    path: 'graficos',
    loadChildren: () => import('./pages/graficos/graficos.module').then( m => m.GraficosPageModule)
  },
  {
    path: 'pedir-cuenta',
    loadChildren: () => import('./pages/pedir-cuenta/pedir-cuenta.module').then( m => m.PedirCuentaPageModule)
  },
  {
    path: 'alta-producto',
    loadChildren: () => import('./pages/alta-producto/alta-producto.module').then( m => m.AltaProductoPageModule)
  },
  {
    path: 'pedidos-pendientes',
    loadChildren: () => import('./pages/pedidos-pendientes/pedidos-pendientes.module').then( m => m.PedidosPendientesPageModule)
  },
  {
    path: 'pedidos-por-confirmar-mozo',
    loadChildren: () => import('./pages/pedidos-por-confirmar-mozo/pedidos-por-confirmar-mozo.module').then( m => m.PedidosPorConfirmarMozoPageModule)
  },
  {
    path: 'lista-espera',
    loadChildren: () => import('./pages/lista-espera/lista-espera.module').then( m => m.ListaEsperaPageModule)
  },
  {
    path: 'pedidos-pendientes-barman',
    loadChildren: () => import('./pages/pedidos-pendientes-barman/pedidos-pendientes-barman.module').then( m => m.PedidosPendientesBarmanPageModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  },
  {
    path: 'idioma-popover',
    loadChildren: () => import('./pages/idioma-popover/idioma-popover.module').then( m => m.IdiomaPopoverPageModule)
  },































];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
