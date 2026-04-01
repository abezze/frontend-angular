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



constructor(
      private ordineS: OrdineService,
      private util: Utilities,
      private dettaglio : DettaglioService,
      private http: HttpClient,
      public auth:AuthServices,
    ) {
  }






  ngOnInit(): void {
    this.dettaglio.cercaOrdineInCorso(this.auth.grant().userId);
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
    //this.dettaglio = this.dettaglio.filter(p => p.id !== dettaglio.id);
  }


  /*get totale() {
    return this.dettaglio.reduce((acc, p) => acc + (p.prezzo * p.quantita), 0);
  }*/

}
