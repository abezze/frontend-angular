import { UtenteService } from './../../services/utente-service';
import { Component, inject, signal } from '@angular/core';
import { AuthServices } from '../../auth/auth-services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from '../../dialogs/login-dialog/login-dialog';
import { RegistrazioneDialog } from '../../dialogs/registrazione-dialog/registrazione-dialog';
import { Utilities } from '../../services/utilities';
import { ChangePassword } from '../../dialogs/change-password/change-password';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly dialog = inject(MatDialog);
  persona : any;
  loadedTipoIndirizzo : any;

  constructor(public auth:AuthServices, private routing:Router, private util: Utilities, private ute: UtenteService){

  }

  login() {
    this.dialog.open(LoginDialog, {
      width: '400px',
      disableClose: false,
      data: {}
    });
  }

  logout() {
    console.log('logout')
    this.auth.resetAll();
    this.routing.navigate(['/dash']);
  }

  profilo() {



    this.ute.getUserAnags()
        .subscribe({
            next: ((r:any) => {
              let anagrafica = {
                nome: r.anagrafiche[0].nome,
                cognome: r.anagrafiche[0].cognome,
                email: r.email,
                telefono: r.anagrafiche[0].telefono,
                via: r.anagrafiche[0].via,
                citta: r.anagrafiche[0].citta,
                cap: r.anagrafiche[0].cap,
                userName: r.userName,
                codiceFiscale : r.anagrafiche[0].codiceFiscale,
                partitaIva: r.anagrafiche[0].partitaIva,
                nazione : r.anagrafiche[0].nazione,
                password : r.password,
                tipoIndirizzo : r.anagrafiche[0].tipoIndirizzo,
                id : r.anagrafiche[0].id
              }

              this.ute.getTipiIndirizzi().subscribe(resp => {
                this.loadedTipoIndirizzo = resp;
                this.persona= r;
                this.util.openDialog(RegistrazioneDialog,
                    {
                      account: anagrafica,
                      mode: "U",
                      tipiIndirizzo : this.loadedTipoIndirizzo
                    },
                    {
                      width: '90vw',
                      maxWidth: '1200px',
                      height: 'auto',
                    }
                  );
              });



            }),
            error: ((r:any) => {
              console.log(r);
            })

        })




    }

    changePWD(){
     this.dialog.open(ChangePassword, {
      width: '400px',
      disableClose: false,
      data: {}
    });
  }

}
