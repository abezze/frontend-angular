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
  creatoDett:number = 0;

  constructor(private http: HttpClient, private cartService : CartService) { }

  cercaOrdineInCorso(userId: string)  {
    let params = new HttpParams().set('userName', userId);

    if (userId!=null){
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
  }

  listDettaglio (idOrdine : number){

    let params = new HttpParams().set('id', idOrdine);

    this.http.get(this.urlDett + "findAllByOrdine" , { params })
      .subscribe({
        next: ((r: any) => {
          console.log("dettaglio ordine trovato  r.id :", r);
          this.dettagli.set(r);
          let quantitaCarrello = 0;
                for (let i = 0; i < r.length; i++) {
                    quantitaCarrello= quantitaCarrello+ r[i].quantita;
                    }
                    console.log("quantitaCarrello ", quantitaCarrello);
                    this.cartService.setCartNumber(quantitaCarrello);
      }), error: err => {
                console.error('Carrello vuoto o non trovato :', err);
                this.cartService.setMsg("Carrello vuoto o non trovato ");
               }


    });

  }

  aggiungiDettaglioAllOrdine(bike:any, ordId:number) : number{
    console.log(" aggiungi dettaglio bike ", bike);

        let dettaglio = {
                quantita: 1,
                ordineId: ordId,
                prodottoId: bike.productCode
            };
            console.log("dettaglio ordine : ", dettaglio);
            this.http.post(this.urlDett+ "create", dettaglio)
              .subscribe({
              next: ((r: any) => {

                console.log("dettaglio ordine creato");

                this.cartService.setMsg("");
                this.cartService.addToCart();

            }),
              error: err => {
              this.cartService.setMsg('Dettaglio ordine non aggiunto ');
              console.error('Dettaglio non creato :', err);
              this.creatoDett = 0;
              }});

        return this.creatoDett;

  }
  
  aggiornaDettaglio(id: number, quantita: number, ordineId: number, prodottoId: number) {
    let dettaglioReq = {
      id: id,  
      quantita: quantita,
      ordineId: ordineId,
      prodottoId: prodottoId
    };
    console.log("DettaglioService.aggiornaDettaglio: ", dettaglioReq);
    return this.http.put(this.urlDett + "update", dettaglioReq).subscribe({
      next: (res) => {
        console.log("Dettaglio aggiornato", res);
        this.listDettaglio(ordineId);
      },
      error: (err) => {
        console.error("Dettaglio non aggiornato", err);
      }
    });
  }
  
  delete(dettaglioId: number, ordineId: number){
    console.log("DettaglioService.delete: ", dettaglioId);
    this.http.delete(this.urlDett + "delete/" + dettaglioId).subscribe({
      next: (res) => {
        console.log("Dettaglio eliminato", res);
        this.listDettaglio(ordineId);
      },
      error: (err) => {
        console.error("Dettaglio non eliminato", err);
      }
    });
  }

}
