import { Component, OnInit } from '@angular/core';
import { OrdineService } from '../../services/ordine-service';
import { Utilities } from '../../services/utilities';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestione-ordini',
  standalone: false,
  templateUrl: './gestione-ordini.html',
  styleUrl: './gestione-ordini.css',
})
export class GestioneOrdini implements OnInit {

  constructor(
      private ordineS: OrdineService,
      private router: Router,
      private util: Utilities
    ) {
  }

  ngOnInit(): void {
    this.ordineS.ordiniList();
  }

  get ordini() {
    return this.ordineS.ordini();
  }
  
  editOrd(ordine : any){
      this.router.navigate(['/dash/ordine'], { 
        state: { 
          ordine: ordine, 
          mode: "ORDINE" 
        } 
      });
    }
  
    confirmDelete(id : number) {
      if (confirm('Sicuro di voler cancellare questo ordine?')) {
        this.ordineS.delete(id);
      }
    }

}
