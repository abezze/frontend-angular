
import { Injectable , signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CartService } from './cart-service';


@Injectable({
  providedIn: 'root',
})
export class OrdineService {
  private urlOrd = "http://localhost:9080/rest/ordine/";
  private urlDett = "http://localhost:9080/rest/dettaglioordine/";
  ordine = signal<any[]>([]);
  idOrdine: number;
  creatoDett:number = 0;



  constructor(private http: HttpClient, private cartService : CartService) { }

   cercaOrdineInCorso(userId: string, bike: any) : number {
    let params = new HttpParams().set('userName', userId);

    this.http.get(this.urlOrd + "findLastByUtenteAndStatoOrdine" , { params })
      .subscribe({
        next: ((r: any) => {
          console.log("ordine trovato già presente r.id :", r.id);
          console.log(r);
          this.idOrdine= r.id;
          console.log(" this.idOrdine ",  this.idOrdine);
          this.ordine.set(r);
          this.aggiungiDettaglio(bike, this.idOrdine);

      })   ,
        error: err => {
          console.log('Not found any order for user :', err);
          let ordinezero = {
                userName: userId
              };
          console.log(ordinezero);
          console.log("ordine non trovato vado a crearlo");
          this.http.post(this.urlOrd+ "create", ordinezero)
            .subscribe({
                next: ((r: any) => {
                  this.ordine.set(r);
                  this.idOrdine= r.id;
                  console.log("ordine creato");
                  console.log(r);
                  console.log(r.id);
                  console.log(" this.idOrdine ",  this.idOrdine);
                   this.aggiungiDettaglio(bike, this.idOrdine);
              }),
               error: err => {
                console.error('Error order impossible to create for user :', err);
               }});
        }

    });
    return this.idOrdine;
}

    aggiungiDettaglio(bike:any, ordId:number) : number{
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





}
