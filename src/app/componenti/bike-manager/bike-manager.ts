import { Component, OnInit } from '@angular/core';
import { ProdottoService } from '../../services/prodotto-service';

@Component({
  selector: 'app-bike-manager',
  standalone: false,
  templateUrl: './bike-manager.html',
  styleUrl: './bike-manager.css',
})
export class BikeManager implements OnInit {


  categoria: any;


  constructor(
    private prodottoS: ProdottoService
  ) {
  }
  ngOnInit(): void {

    this.prodottoS.list();
    this.prodottoS.categorieList();
  }

   get prodotti() {
    return this.prodottoS.prodotti();
  }
  get categorie() {
    return this.prodottoS.categorie();
  }

  onCategoriaChange(tipoSelect : any){

  }
  search() {


  }

}
