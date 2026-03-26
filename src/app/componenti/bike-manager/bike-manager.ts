import { Component, OnInit } from '@angular/core';
import { ProdottoService } from '../../services/prodotto-service';

@Component({
  selector: 'app-bike-manager',
  standalone: false,
  templateUrl: './bike-manager.html',
  styleUrl: './bike-manager.css',
})
export class BikeManager implements OnInit {
  tipo: any = null;
  categ: any = null;
  alim: any = null;
  colore: any = null;
  marca: any = null;

  categories: any;
  alimentazione: any;


  constructor(
    private prodottoS: ProdottoService
  ) {
  }
  ngOnInit(): void {

    this.prodottoS.list();
  }

   get prodotti() {
    return this.prodottoS.prodotti();
  }




}
