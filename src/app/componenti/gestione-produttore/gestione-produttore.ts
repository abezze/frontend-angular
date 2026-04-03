import { Component, OnInit } from '@angular/core';
import { Utilities } from '../../services/utilities';
import { ProduttoreService } from '../../services/produttore-service';
import { ProduttoreDialog } from '../../dialogs/produttore-dialog/produttore-dialog';

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
    this.util.openDialog(
      ProduttoreDialog,
      {
        prodotto: null,
        mode: "C"

      },
      {
        width: '90vw',
        maxWidth: '1200px',
        height: 'auto',
      }
    );
  }

  editProd(produttore : any){
    console.log(produttore);
    this.util.openDialog(
      ProduttoreDialog,
      {
        produttore: produttore,
        mode: "U"
      },
      {
        width: '90vw',
        maxWidth: '1200px',
        height: 'auto',
      }
    );
  }

}
