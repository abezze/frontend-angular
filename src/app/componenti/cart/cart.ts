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

}
