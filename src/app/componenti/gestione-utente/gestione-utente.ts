import { Component } from '@angular/core';
import { UtenteService } from '../../services/utente-service';
import { AuthServices } from '../../auth/auth-services';
import { RegistrazioneDialog } from '../../dialogs/registrazione-dialog/registrazione-dialog';
import { Utilities } from '../../services/utilities';

@Component({
  selector: 'app-gestione-utente',
  standalone: false,
  templateUrl: './gestione-utente.html',
  styleUrl: './gestione-utente.css',
})
export class GestioneUtente {
  categoria: any;
  persona : any;
  loadedTipoIndirizzo : any;
  loadedTipoRuolo : any;


  constructor(
    private util: Utilities,
    private utenteS: UtenteService, 
    public auth: AuthServices
  ) {

    }

  ngOnInit(): void {

    this.utenteS.list();
    this.utenteS.getTipiRuoli().subscribe(resp => {
      this.loadedTipoRuolo = resp;
    });
//    this.utenteS.categorieList();
  }

   get utenti() {
    return this.utenteS.utenti();
  }

/*  get categorie() {
    return this.utenteS.categorie();
  }

  onCategoriaChange(tipoSelect : any){

  }
  search() {


  }
*/

  profilo(userId: string) {
    this.utenteS.getUserAnags(userId)
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
                  id : r.anagrafiche[0].id,
                  role: r.role
                }
  
                this.utenteS.getTipiIndirizzi().subscribe(resp => {
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

  
  changeTipoRuolo(userName: string, ruolo: string) {
    const utente = {
      "userName": userName,
      "role": ruolo
    }
    console.log("utente: ", utente);
    this.utenteS.updateRuolo(utente)
      .subscribe({
        next: ((resp: any) => {

        }),
        error: ((resp: any) => {
          console.log(resp.error.msg);
        })
      });
  }
}

