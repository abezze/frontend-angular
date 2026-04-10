import { Component, OnInit } from '@angular/core';
import { OrdineService } from '../../services/ordine-service';
import { Utilities } from '../../services/utilities';
import { Router } from '@angular/router';
import { debounce, debounceTime, distinctUntilChanged, Subject, switchMap, timer } from 'rxjs';
import { AuthServices } from '../../auth/auth-services';

@Component({
  selector: 'app-gestione-ordini',
  standalone: false,
  templateUrl: './gestione-ordini.html',
  styleUrl: './gestione-ordini.css',
})
export class GestioneOrdini implements OnInit {
  mode = '';
  searchNumero = '';
  searchNomeUtente = '';
  searchStato = '';
  loadedStatiOrdine : any;

  tempoDebounce: number = 300;

  private searchTerms = new Subject<any>()

  constructor(
      private ordineS: OrdineService,
      private router: Router,
      public auth: AuthServices
    ) {
      this.searchTerms.pipe(
          debounce(() => timer(this.tempoDebounce)),
          distinctUntilChanged(),      // Procedi solo se il testo è cambiato davvero
          switchMap((term) => this.ordineS.cercaOrdiniFiltrati(term.id, term.userName, term.statoOrdine)) // Annulla la vecchia chiamata se ne arriva una nuova
        ).subscribe((results: any[]) => {
          this.ordineS.ordini.set(results);      // Aggiorna la UI con i risultati corretti
      });
  }

  ngOnInit(): void {
    this.mode = history.state.mode;

    this.ordineS.getStatiOrdine().subscribe(resp => {
      this.loadedStatiOrdine = resp;
    });

    if (this.mode === "VISUALIZZA") {
      this.searchNomeUtente = this.auth.grant().userId;
    }
    
    this.search(0);
  }

  get ordini() {
    return this.ordineS.ordini();
  }
  
  editOrd(ordine : any){
    this.router.navigate(['/dash/ordine'], { 
      state: { 
        ordine: ordine, 
        mode: "ORDINE",
        isVisualizza: this.mode === "VISUALIZZA"
      } 
    });
  }

  searchOridni() {
    this.search(300);
  }

  private search(tempoDebounce: number) {
    this.tempoDebounce = tempoDebounce;
    this.searchTerms.next({
      id: this.searchNumero,
      userName: this.searchNomeUtente,
      statoOrdine: this.searchStato
    });
  }

}
