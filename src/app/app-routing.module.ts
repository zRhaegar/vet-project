import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HistoricoConsultasPage } from './historico-consultas/historico-consultas.page';
import { BookingPage } from './booking/booking.page';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';
import { ContatoPage } from './contato/contato.page'; // Ajuste o caminho se necessário


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',  
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
//{ path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule) },
  {
    path: 'services',
    loadChildren: () => import('./services/services.module').then(m => m.ServicesPageModule)
  },
  {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'historico-consultas',
    loadChildren: () => import('./historico-consultas/historico-consultas.module').then(m => m.HistoricoConsultasPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { path: 'historico-consultas', component: HistoricoConsultasPage },
  { path: 'editar-consulta', component: BookingPage },  
  
  {
    path: 'contato',
    loadChildren: () => import('./contato/contato.module').then(m => m.ContatoPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'pet-card',
    loadChildren: () => import('./pet-card/pet-card.module').then(m => m.PetCardModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }