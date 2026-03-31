import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CartService } from './cart-service';


@Injectable({
  providedIn: 'root',
})
export class DettaglioService {
   private urlOrd = "http://localhost:9080/rest/ordine/";
  private urlDett = "http://localhost:9080/rest/dettaglioordine/";
  dettagli = signal<any[]>([]);

  constructor(private http: HttpClient, private cartService : CartService) { }

  cercaOrdineInCorso(userId: string)  {
    let params = new HttpParams().set('userName', userId);

    this.http.get(this.urlOrd + "findLastByUtenteAndStatoOrdine" , { params })
      .subscribe({
        next: ((r: any) => {
          console.log("ordine trovato  r.id :", r.id);

          this.listDettaglio( r.id);

      }), error: err => {
                console.error('Error order impossible to create for user :', err);
                this.cartService.setMsg("Carrello vuoto o non trovato ");
               }


    });

  }

  listDettaglio (idOrdine : number){

    let params = new HttpParams().set('id', idOrdine);

    this.http.get(this.urlDett + "findAllByOrdine" , { params })
      .subscribe({
        next: ((r: any) => {
          console.log("dettaglio ordine trovato  r.id :", r.id);
          this.dettagli.set(r);

      }), error: err => {
                console.error('Carrello vuoto o non trovato :', err);
                this.cartService.setMsg("Carrello vuoto o non trovato ");
               }


    });

  }



}
