import { Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtenteService } from '../../services/utente-service';
import { AuthServices } from '../../auth/auth-services';
import { Router } from '@angular/router';
import { Utilities } from '../../services/utilities';
import { NgForm } from '@angular/forms';
import { RegistrazioneDialog } from '../registrazione-dialog/registrazione-dialog';
import { ProdottoService } from '../../services/prodotto-service';
import { DettaglioService } from '../../services/dettaglio-service';

@Component({
  selector: 'app-login-dialog',
  standalone: false,
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.css',
})
export class LoginDialog {
 msg = signal('');
 loadedTipoIndirizzo : any;
  readonly dialog = inject(MatDialog);

  constructor(
    private account: UtenteService,
    private prodottoS: ProdottoService,
    private dettaglio : DettaglioService,
    private auth: AuthServices,
    private routing: Router,
    private util: Utilities,
    private dialogRef: MatDialogRef<LoginDialog>
  ) {

  }

  onSubmit(signin: NgForm) {
    this.account.login({
      userName: signin.form.value.userName,
      password: signin.form.value.password
    }).subscribe({
      next: (resp: any) => {
        this.msg.set("");
        console.log(resp)
        this.auth.setAuthenticated(resp.id);
        if (resp.role == 'ADMIN') this.auth.setAdmin();
        if (resp.role == 'USER') this.auth.setUser();

        console.log('[LoginDialog] dopo login, isAuthenticated =', this.auth.isAuthenticated() );

        this.prodottoS.list();
        this.prodottoS.categorieList();
        this.prodottoS.produttoriList();
        this.dettaglio.cercaOrdineInCorso(this.auth.grant().userId);

        this.dialogRef.close(true);
        this.routing.navigate(['/dash']);
      },
      error: (resp: any) => {
        console.log(resp);
        this.msg.set(resp.error.msg);
      }
    });
  }


  registrazione() {
    this.account.getTipiIndirizzi().subscribe(resp => {
                this.loadedTipoIndirizzo = resp;

        this.util.openDialog(RegistrazioneDialog,
          {
            account: null,
            mode: "C",
            tipiIndirizzo : this.loadedTipoIndirizzo
          },
          {
            width: '90vw',
            maxWidth: '1200px',
            height: 'auto',
          }
        );
    });

  }



}
