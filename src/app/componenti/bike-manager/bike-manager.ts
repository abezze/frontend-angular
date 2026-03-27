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
  produttore : any;


  constructor(
    private prodottoS: ProdottoService
  ) {
  }
  ngOnInit(): void {

    this.prodottoS.list();
    this.prodottoS.categorieList();
    this.prodottoS.produttoriList();
  }

   get prodotti() {
    return this.prodottoS.prodotti();
  }
  get categorie() {
    return this.prodottoS.categorie();
  }

  get produttori() {
    return this.prodottoS.produttori();
  }

  onCategoriaChange(tipoSelect : any){
     if (tipoSelect.id != null) {
      this.search();
     }
  }
  onProduttoreChange(tipoSelect : any){
      if (tipoSelect.id != null) {
      this.search();
     }
  }
  search() {
     let cateId = this.categoria == null ? null : this.categoria.id;
     let produttoreId = this.produttore == null ? null : this.produttore.id;
    console.log("filtri:" + cateId + "/" + produttoreId )
    this.prodottoS.list(cateId, produttoreId);

  }

}
