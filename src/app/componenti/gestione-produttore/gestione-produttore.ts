import { Component, OnInit } from '@angular/core';
import { Utilities } from '../../services/utilities';
import { ProduttoreService } from '../../services/produttore-service';

@Component({
  selector: 'app-gestione-produttore',
  standalone: false,
  templateUrl: './gestione-produttore.html',
  styleUrl: './gestione-produttore.css',
})
export class GestioneProduttore  implements OnInit{

  constructor(
      private produttoriS: ProduttoreService,
      private util: Utilities
    ) {
    }

  ngOnInit(): void {

    this.produttoriS.produttoriList();
  }

  get produttori() {
    return this.produttoriS.produttori();
  }

  newProd(){
      /*this.util.openDialog(ProdottoDialog,
                          {
                            prodotto: null,
                            mode: "C"

                          },
                          {
                            width: '90vw',
                            maxWidth: '1200px',
                            height: 'auto',
                          }
                        );*/
    }

    editProd(bike : any){
      console.log(bike);
      /*this.util.openDialog(ProdottoDialog,
                          {
                            prodotto: bike,
                            mode: "U"

                          },
                          {
                            width: '90vw',
                            maxWidth: '1200px',
                            height: 'auto',
                          }
                        );*/
    }
    confirmDelete(productCode : number) {
      /*if (confirm('Sicuro di voler cancellare questo prodotto?')) {
        this.prodottoS.delete(productCode);
      }*/
    }


}
