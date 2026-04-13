
import { Injectable , signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CartService } from './cart-service';
import { DettaglioService } from './dettaglio-service';
import { IndirizzoSpedizioneService } from './indirizzo-spedizione-service';
import { PagamentoDialog } from '../dialogs/pagamento-dialog/pagamento-dialog';
import { Utilities } from './utilities';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class OrdineService {
  private urlOrd = "http://localhost:9080/rest/ordine/";
  ordine = signal<any | null>(null);
  ordini = signal<any[]>([]);
  idOrdine: number;



  constructor(
    private http: HttpClient, 
    private dettaglioS: DettaglioService,
    private indirizzoSpedizioneS: IndirizzoSpedizioneService,
    private util: Utilities,
    private router : Router
    ) {

    }

   cercaOrdineInCorso(userId: string, bike: any) : number {
    this.findLastByUtenteAndStatoOrdine(userId)
      .subscribe({
        next: ((r: any) => {
          if (r) { // Ordine trovato già presente
            this.idOrdine= r.id;
            this.ordine.set(r);
            this.dettaglioS.aggiungiDettaglioAllOrdine(bike, this.idOrdine);
          } else { // Ordine non trovato vado a crearlo
            let ordinezero = {
              userName: userId
            };

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
      })   ,
        error: err => {
          console.log('Not found any order for user :', err);
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
  
  update(body: any){
    return this.http.put(this.urlOrd + "update", body);
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

  getOrdineById(id: number){
    let params = new HttpParams().set('id', id);
    return this.http.get(this.urlOrd + "findById", {params});

  }
  
  getStatiOrdine(){
    return this.http.get(this.urlOrd + "listStatiOrdine");
  }

  cercaOrdiniFiltrati(id: number, userName: string, statoOrdine: string){
    let params = new HttpParams()
      .set('id', id)
      .set('userName', userName)
      .set('statoOrdine', statoOrdine);
    return this.http.get<any[]>(this.urlOrd + "cercaOrdiniFiltrati", {params});
  }

  confermaOrdine(ordine: any, userName: string, indirizzoSedizione: any) {
    if (ordine) {
      console.log("TODO");
    } else {
      this.findLastByUtenteAndStatoOrdine(userName).subscribe({
        next: (ordineTrovato: any) => {
          indirizzoSedizione.ordineId = ordineTrovato.id;
          this.indirizzoSpedizioneS.create(indirizzoSedizione).subscribe({
            next: () => {
              console.log("Indirizzo di spedizione salvato correttamente");
            },
            error: err => console.error("Errore durante il salvataggio dell'indirizzo di spedizione: ", err)
          });

          ordineTrovato.statoOrdine = "CONFERMATO";
          this.update(ordineTrovato).subscribe({
            next: () => {
              console.log("Ordine " + ordineTrovato.id + " aggiornato correttamente");
            },
            error: err => console.error("Errore durante il l'aggiornamento dell'ordine " + ordineTrovato.id + ": ", err)
          });

          const dialogRef = this.util.openDialog(PagamentoDialog,
            null,
            {
              width: '90vw',
              maxWidth: '1200px',
              height: 'auto',
            }
          );

          console.log("dialogRef", dialogRef);

          dialogRef.afterClosed().subscribe(result => {
            console.log("afterClosed", result);
            this.router.navigate([ '/dash/home']);
          });
        },
        error: err => console.error("Ordine non trovato: ", err)
      });
    }
  }

  findLastByUtenteAndStatoOrdine(userName: string){
    let params = new HttpParams().set("userName", userName);
    return this.http.get(this.urlOrd + "findLastByUtenteAndStatoOrdine", {params});
  }

}
