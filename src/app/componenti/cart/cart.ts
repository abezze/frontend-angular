import { Component, OnInit, signal } from '@angular/core';
import { OrdineService } from '../../services/ordine-service';
import { DettaglioService } from '../../services/dettaglio-service';
import { Utilities } from '../../services/utilities';
import { HttpClient } from '@angular/common/http';
import { AuthServices } from '../../auth/auth-services';
import { Router } from '@angular/router';

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



constructor(
      private ordineS: OrdineService,
      private dettaglioS : DettaglioService,
      private router: Router,
      public auth:AuthServices,
    ) {
  }

  ngOnInit(): void {
    this.ordineS.getStatiOrdine().subscribe(resp => {
      this.loadedStatiOrdine = resp;
      this.inizializza();
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
        }
      } else {
        this.dettaglioS.cercaOrdineInCorso(this.ordine.utente.userName);
      }
    } else {
      this.dettaglioS.cercaOrdineInCorso(this.auth.grant().userId);
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

  }

  eliminaOrdine() {
    if (confirm('Sicuro di voler cancellare questo ordine?')) {
      this.ordineS.delete(this.ordine.id);
    }

    if (this.mode == "ORDINE") {
      this.router.navigate(['/dash/ordini']);
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

}
