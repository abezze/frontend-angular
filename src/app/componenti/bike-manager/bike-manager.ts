import { Component, OnInit } from '@angular/core';
import { ProdottoService } from '../../services/prodotto-service';
import { Utilities } from '../../services/utilities';
import { ProdottoDialog } from '../../dialogs/prodotto-dialog/prodotto-dialog';
import { ShowImageDialog } from '../../dialogs/show-image-dialog/show-image-dialog';

@Component({
  selector: 'app-bike-manager',
  standalone: false,
  templateUrl: './bike-manager.html',
  styleUrl: './bike-manager.css',
})
export class BikeManager implements OnInit {


  categoria: any;
  produttore : any;
  selectedImage: string | null = null;

  constructor(
    private prodottoS: ProdottoService,
    private util: Utilities
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

  newProd(){
    this.util.openDialog(ProdottoDialog,
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

  editProd(bike : any){
    console.log(bike);
    this.util.openDialog(ProdottoDialog,
      {
        prodotto: bike,
        mode: "U"

      },
      {
        width: '90vw',
        maxWidth: '1200px',
        height: 'auto',
      }
    );
  }

  openImage(image: any) {
    console.log("image: ", image);
    this.util.openDialog(ShowImageDialog,
      {
        image: image
      }
    );
  }

}
