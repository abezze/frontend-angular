import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './componenti/dashboard/dashboard';
import { GestioneUtente } from './componenti/gestione-utente/gestione-utente';
import { Home } from './componenti/home/home';
import { authGuard } from './auth/auth-guard';
import { authAdminGuard } from './auth/auth-admin-guard';
import { Cart } from './componenti/cart/cart';
import { BikeManager } from './componenti/bike-manager/bike-manager';
import { GestioneProduttore } from './componenti/gestione-produttore/gestione-produttore';
import { GestioneOrdini } from './componenti/gestione-ordini/gestione-ordini';

const routes: Routes = [
  { path: '', redirectTo: 'dash', pathMatch: 'full' },
  {path:'dash', component:Dashboard, children:[
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home', component:Home},
    {path: 'cart', component:Cart, canActivate:[authGuard]},
    { path: 'bike', component: BikeManager, canActivate: [authGuard, authAdminGuard] },
    {path: 'user', component:GestioneUtente, canActivate:[authGuard, authAdminGuard]},
    { path: 'produttori', component:GestioneProduttore, canActivate: [authGuard, authAdminGuard]},
    { path: 'ordini', component:GestioneOrdini, canActivate: [authGuard, authAdminGuard]}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
