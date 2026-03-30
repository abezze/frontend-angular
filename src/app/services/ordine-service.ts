import { Injectable , signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrdineService {
  private urlOrd = "http://localhost:9080/rest/ordine/";
  private urlDett = "http://localhost:9080/rest/dettaglioordine/";
  ordine = signal<any[]>([]);
  idOrdine: number;

  constructor(private http: HttpClient) { }

  cercaOrdineInCorso(userId: string){
    let params = new HttpParams().set('userName', userId);

    this.http.get(this.urlOrd + "findLastByUtenteAndStatoOrdine" , { params })
      .subscribe({
        next: ((r: any) => {
          console.log("ordine trovato già presente");
          console.log(r);
          this.idOrdine= r.id;
          this.ordine.set(r);
      })   ,
        error: err => {
          console.log('Not found any order for user :', err);
          let ordinezero = {
                userName: userId
              };
          console.log(ordinezero);
          console.log("ordine non trovato cado a crearlo");
          this.http.post(this.urlOrd+ "create", ordinezero)
            .subscribe({
                next: ((r: any) => {
                  this.ordine.set(r);
                  this.idOrdine= r.id;
                  console.log("ordine creato");
                  console.log("r");
                  console.log(r.ordine.id);
              }),
               error: err => {
                console.error('Error order impossible to create for user :', err);
               }});
        }

    });
}

    aggiungiDettaglio(bike:any){
      console.log(" aggiungi dettaglio bike ", bike);
          let dettaglio = {
                  quantita: 1,
                  ordineId: this.idOrdine,
                  prodottoId: bike.productCode
              };
              console.log(dettaglio);
              this.http.post(this.urlDett+ "create", dettaglio)
                .subscribe({
                next: ((r: any) => {

                  console.log("dettaglio ordine creato");

              }),
               error: err => {
                console.error('Dettaglio non creato :', err);
               }});

    }





}
