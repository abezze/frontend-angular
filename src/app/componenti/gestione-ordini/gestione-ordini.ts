import { Component, OnInit } from '@angular/core';
import { OrdineService } from '../../services/ordine-service';
import { Utilities } from '../../services/utilities';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-gestione-ordini',
  standalone: false,
  templateUrl: './gestione-ordini.html',
  styleUrl: './gestione-ordini.css',
})
export class GestioneOrdini implements OnInit {

  searchNumero = '';
  searchNomeUtente = '';
  searchStato = '';
  loadedStatiOrdine : any;

  private searchTerms = new Subject<any>()

  constructor(
      private ordineS: OrdineService,
      private router: Router
    ) {
      this.searchTerms.pipe(
        debounceTime(300),           // Aspetta 300ms di silenzio
        distinctUntilChanged(),      // Procedi solo se il testo è cambiato davvero
        switchMap((term) => this.ordineS.cercaOrdiniFiltrati(term.id, term.userName, term.statoOrdine)) // Annulla la vecchia chiamata se ne arriva una nuova
      ).subscribe((results: any[]) => {
        this.ordineS.ordini.set(results);      // Aggiorna la UI con i risultati corretti
    });
  }

  ngOnInit(): void {
    this.ordineS.ordiniList();
    this.ordineS.getStatiOrdine().subscribe(resp => {
      this.loadedStatiOrdine = resp;
    });
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

  search() {
    this.searchTerms.next({
      id: this.searchNumero,
      userName: this.searchNomeUtente,
      statoOrdine: this.searchStato
    });
  }

}
