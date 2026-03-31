import { Component, OnInit } from '@angular/core';
import { ProdottoService } from '../../services/prodotto-service';
import { Utilities } from '../../services/utilities';
import { AuthServices } from '../../auth/auth-services';
import { OrdineService } from '../../services/ordine-service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  ordineId:number;
  categoria: any;
  produttore : any;
  selectedImage: string | null = null;

  constructor(
    private prodottoS: ProdottoService,
    private util: Utilities,
    public auth:AuthServices,
    private ordineS : OrdineService
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
  deleteFromCart(bike : any){

  }
  addToCart(bike : any){

      this.ordineId = this.ordineS.cercaOrdineInCorso(this.auth.grant().userId);
      //this.ordineS.ordine
      this.ordineS.aggiungiDettaglio(bike, this.ordineId);
  }

  vaiAlCarrello(){


    }



  openImage(url: string) {
    this.selectedImage = url;
  }

  closeImage() {
    this.selectedImage = null;
  }




}

