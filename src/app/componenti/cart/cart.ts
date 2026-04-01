import { Component, OnInit, signal } from '@angular/core';
import { OrdineService } from '../../services/ordine-service';
import { DettaglioService } from '../../services/dettaglio-service';
import { Utilities } from '../../services/utilities';
import { HttpClient } from '@angular/common/http';
import { AuthServices } from '../../auth/auth-services';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit{
  ordineDati: any;
  mode: any;



constructor(
      private ordineS: OrdineService,
      private util: Utilities,
      private dettaglio : DettaglioService,
      private http: HttpClient,
      public auth:AuthServices,
    ) {
  }






  ngOnInit(): void {
    
    const state = history.state;

    if (state && state.ordine) {
      this.ordineDati = state.ordine;
      this.mode = state.mode;
      if (this.mode == "U") {
        this.dettaglio.cercaOrdineInCorso(this.auth.grant().userId); // TODO
      } else {
        this.dettaglio.cercaOrdineInCorso(this.auth.grant().userId);
      }
    } else {
      this.dettaglio.cercaOrdineInCorso(this.auth.grant().userId);
    }
  }

  get dettagli() {
    return this.dettaglio.dettagli();
  }

  aggiungi(dettaglio: any) {
    if (dettaglio.prodotto.quantita >dettaglio.quantita +1)
    dettaglio.quantita++;
  }


  togli(dettaglio: any) {
    if (dettaglio.quantita > 1) {
      dettaglio.quantita--;
    } else {
      this.rimuoviDalCarrello(dettaglio);
    }
  }

    rimuoviDalCarrello(dettaglio: any) {
    //this.dettagli = this.dettagli.filter(p => p.id !== dettaglio.id);
  }


  get totale() {
    return this.dettagli.reduce((acc, p) => acc + (p.prodotto.prezzo * p.quantita), 0);
  }

  confermaOrdine (){

  }

}
