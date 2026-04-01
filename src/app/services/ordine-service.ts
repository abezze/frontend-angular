
import { Injectable , signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CartService } from './cart-service';
import { DettaglioService } from './dettaglio-service';


@Injectable({
  providedIn: 'root',
})
export class OrdineService {
  private urlOrd = "http://localhost:9080/rest/ordine/";
  ordine = signal<any[]>([]);
  ordini = signal<any[]>([]);
  idOrdine: number;



  constructor(private http: HttpClient, private dettaglioS: DettaglioService) { }

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
          this.dettaglioS.aggiungiDettaglioAllOrdine(bike, this.idOrdine);

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
                   this.dettaglioS.aggiungiDettaglioAllOrdine(bike, this.idOrdine);
              }),
               error: err => {
                console.error('Error order impossible to create for user :', err);
               }});
        }

    });
    return this.idOrdine;
  }

  ordiniList() {
    let params = new HttpParams();

    this.http.get(this.urlOrd + "list")
      .subscribe({
        next: ((r: any) => this.ordini.set(r)),
    });
  }

  delete(id:{}){
    console.log("delete: ", id);
    this.http.delete(this.urlOrd + "delete/" + id).subscribe({
      next: () => {
        console.log('Deleted successfully');
        this.ordiniList();
      },
      error: err => console.error('Error deleting: ', err)
    });
  }

}
