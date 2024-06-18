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
  /*{
    path: '**',
    redirectTo: 'auth'
  },*/
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
