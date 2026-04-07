import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatBadgeModule} from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Dashboard } from './componenti/dashboard/dashboard';
import { Home } from './componenti/home/home';
import { GestioneUtente } from './componenti/gestione-utente/gestione-utente';
import { Cart } from './componenti/cart/cart';
import { LoginDialog } from './dialogs/login-dialog/login-dialog';
import { RegistrazioneDialog } from './dialogs/registrazione-dialog/registrazione-dialog';
import { BikeManager } from './componenti/bike-manager/bike-manager';
import { ChangePassword } from './dialogs/change-password/change-password';
import { ProdottoDialog } from './dialogs/prodotto-dialog/prodotto-dialog';
import { GestioneProduttore } from './componenti/gestione-produttore/gestione-produttore';
import { ProduttoreDialog } from './dialogs/produttore-dialog/produttore-dialog';
import { GestioneOrdini } from './componenti/gestione-ordini/gestione-ordini';
import { ShowImageDialog } from './dialogs/show-image-dialog/show-image-dialog';


@NgModule({
  declarations: [
    App,
    Dashboard,
    Home,
    GestioneUtente,
    Cart,
    LoginDialog,
    RegistrazioneDialog,
    BikeManager,
    ChangePassword,
    ProdottoDialog,
    GestioneProduttore,
    ProduttoreDialog,
    GestioneOrdini,
    ShowImageDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
     MatInputModule,
     MatButtonModule,
     MatFormFieldModule,
     MatSidenavModule,
     MatListModule,
     MatToolbarModule,
     MatIconModule,
     MatTooltipModule,
     MatMenuModule,
     MatDialogModule,
    MatRadioModule,
    MatCardModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatExpansionModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
  ],
  bootstrap: [App]
})
export class AppModule { }
