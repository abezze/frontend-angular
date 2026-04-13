import { Component, OnInit, signal } from '@angular/core';
import { OrdineService } from '../../services/ordine-service';
import { DettaglioService } from '../../services/dettaglio-service';
import { Utilities } from '../../services/utilities';
import { HttpClient } from '@angular/common/http';
import { AuthServices } from '../../auth/auth-services';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtenteService } from '../../services/utente-service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit{
  ordine: any;
  mode: any;
  isVisualizza: boolean;
  loadedStatiOrdine : any;
  loadedTipoIndirizzo : any;

  indirizzoForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    tipoIndirizzo: new FormControl(null, Validators.required),
    nome: new FormControl(null, Validators.required),
    cognome: new FormControl(null, Validators.required),
    via: new FormControl(null, Validators.required),
    citta: new FormControl(null, Validators.required),
    cap: new FormControl(null, Validators.required),
    nazione : new FormControl(null, Validators.required),
    telefono : new FormControl(null, Validators.required),
    codiceFiscale: new FormControl(null, Validators.required),
    partitaIva: new FormControl(null),
    //ordineId: new FormControl(null, Validators.required)
  });

constructor(
      private ordineS: OrdineService,
      private dettaglioS : DettaglioService,
      private router: Router,
      public auth:AuthServices,
      private utenteS: UtenteService,
      private accoutServices: UtenteService
    ) {
  }

  ngOnInit(): void {
    this.ordineS.getStatiOrdine().subscribe(resp => {
      this.loadedStatiOrdine = resp;

      this.utenteS.getTipiIndirizzi().subscribe(resp => {
        this.loadedTipoIndirizzo = resp;
        this.inizializza();
      });
    });
  }

  private inizializza() {
    this.ordine = null;
    this.mode = null;
    this.isVisualizza = false;
    const state = history.state;
    if (state && state.ordine) {
      this.ordine = state.ordine; 
      this.mode = state.mode;
      if (this.mode == "ORDINE") {
        this.dettaglioS.dettagli.set(this.ordine.dettagli);
        if (state.isVisualizza) {
          this.isVisualizza = state.isVisualizza;
          this.indirizzoForm.disable();
        }
      } else {
        this.dettaglioS.cercaOrdineInCorso(this.ordine.utente.userName);
      }
      
    } else {
      this.dettaglioS.cercaOrdineInCorso(this.auth.grant().userId);
    }

    if (this.ordine?.indirizzo) {
      this.indirizzoForm.patchValue(this.ordine.indirizzo);
    }
  }

  get dettagli() {
    return this.dettaglioS.dettagli();
  }

  aggiungi(dettaglio: any) {
    if (dettaglio.prodotto.quantita >dettaglio.quantita ){
        if (this.ordine) {
          this.ordineS.cercaOrdineInCorso(this.ordine.utente.userName, dettaglio.prodotto);
        }
        else {
          this.ordineS.cercaOrdineInCorso(this.auth.grant().userId, dettaglio.prodotto);
        }
      dettaglio.quantita++;
    }
  }


  togli(dettaglio: any) {
    if (dettaglio.quantita > 1) {
      let ordineId = this.ordine?.id || this.ordineS.ordine()?.id;
      this.dettaglioS.aggiornaDettaglio(dettaglio.id, dettaglio.quantita-1, ordineId, dettaglio.prodotto.productCode);
    } else {
      this.rimuoviDalCarrello(dettaglio);
    }
  }

  rimuoviDalCarrello(dettaglio: any) {
    if (confirm('Sicuro di voler togliere il prodotto dall\'ordine?')) {
      let ordineId = this.ordine?.id || this.ordineS.ordine()?.id;
      this.dettaglioS.delete(dettaglio.id, ordineId);
    }
  }


  get totale() {
    return this.dettagli.reduce((acc, p) => acc + (p.prodotto.prezzo * p.quantita), 0);
  }

  confermaOrdine (){
    if (this.indirizzoForm.invalid) {
      console.log("Form non valido"); // TODO inserire messaggio di errore
    }
    
    console.log("IndirizzoForm: ", this.indirizzoForm.value);
    this.ordineS.confermaOrdine(this.ordine, this.auth.grant().userId, this.indirizzoForm.value);
  }

  eliminaOrdine() {
    if (confirm('Sicuro di voler cancellare questo ordine?')) {
      if (!this.ordine) {
        this.ordineS.findLastByUtenteAndStatoOrdine(this.auth.grant().userId).subscribe({
          next: (ordineTrovato: any) => {
            this.ordineS.delete(ordineTrovato.id);
              this.router.navigate(['/dash/home']);
          },
          error: err => console.error("Errore durante il recupero dell'ordine in corso di " + this.auth.grant().userId + ": ", err)
        });
      } else {
        this.ordine.statoOrdine = "CANCELLATO";
        this.ordineS.update(this.ordine).subscribe({
          next: () => {
            console.log("Ordine " + this.ordine.id + " aggiornato correttamente");
            if(this.isVisualizza) {
              this.router.navigate(["/dash/visualizzaordini"], { 
                state: { mode: 'VISUALIZZA' } 
              });
            } else if(this.mode === "ORDINE") {
              this.router.navigate(["/dash/ordini"]);
            } else {
              this.router.navigate(['/dash/home']);
            }
          },
          error: err => console.error("Errore durante il l'aggiornamento dell'ordine " + this.ordine.id + ": ", err)
        });
      }
    }
  }

  
  changeStatoOrdine(id: number, statoOrdine: string) {
    const ordineReq = {
      "id": id,
      "statoOrdine": statoOrdine
    }
    this.ordineS.update(ordineReq)
      .subscribe({
        next: ((resp: any) => {

        }),
        error: ((resp: any) => {
          console.log(resp.error.msg);
        })
      });
  }

  changeTipoIndirizzo(tipoIndirizzo: string) {
    console.log("Tipo indirizzo selezionato: ", tipoIndirizzo);
    if (this.ordine) {
      
    } else {console.log("Ordine non trovato: ", this.ordine);
      this.accoutServices.getUserAnags(this.auth.grant().userId).subscribe({
        next: ((user:any) => {
          let indirizzoTrovato = false;
          for (let i = 0; i < user.anagrafiche.length; i++) {
            if (user.anagrafiche[i].tipoIndirizzo == tipoIndirizzo) {
              this.indirizzoForm.patchValue({
                tipoIndirizzo: user.anagrafiche[i].tipoIndirizzo,
                nome: user.anagrafiche[i].nome,
                cognome: user.anagrafiche[i].cognome,
                via: user.anagrafiche[i].via,
                citta: user.anagrafiche[i].citta,
                cap: user.anagrafiche[i].cap,
                nazione : user.anagrafiche[i].nazione,
                telefono : user.anagrafiche[i].telefono,
                codiceFiscale: user.anagrafiche[i].codiceFiscale,
                partitaIva: user.anagrafiche[i].partitaIva
              });

              indirizzoTrovato = true;

              break;
            }
          }

          if (!indirizzoTrovato) {
            this.indirizzoForm.reset({
              tipoIndirizzo: this.indirizzoForm.get('tipoIndirizzo')?.value
            });
          }
        })
      });
    }

  }

  vaiAlCarrello() {
    this.router.navigate([ '/dash','cart']);
  }

  vaiAlPagamento() {
    
  }

}
