import { UtenteService } from './../../services/utente-service';
import { Component, inject, signal } from '@angular/core';
import { AuthServices } from '../../auth/auth-services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from '../../dialogs/login-dialog/login-dialog';
import { RegistrazioneDialog } from '../../dialogs/registrazione-dialog/registrazione-dialog';
import { Utilities } from '../../services/utilities';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly dialog = inject(MatDialog);
  persona : any;

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
              this.persona= r;
              console.log("Ramo OK");
              console.log(r);
              console.log("PERSONA");
              console.log(this.persona);
              /*this.updateForm.patchValue({
                nome:r.nome,
                cognome:r.cognome,
                email:r.email,
                colore:r.colore
              })*/
             this.util.openDialog(RegistrazioneDialog,
                    {
                      account: this.persona,
                      mode: "U"
                    },
                    {
                      width: '90vw',
                      maxWidth: '1200px',
                      height: 'auto',
                    }
                  );

            }),
            error: ((r:any) => {
              console.log(r);
            })

        })




    }

}
