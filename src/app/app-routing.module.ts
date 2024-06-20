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
    path: 'vincular-mesa',
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
    path: '**',
    redirectTo: 'menu'
  },











];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
