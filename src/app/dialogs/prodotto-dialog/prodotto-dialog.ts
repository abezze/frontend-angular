import { Component, Inject, OnInit, signal} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProdottoService } from '../../services/prodotto-service';

@Component({
  selector: 'app-prodotto-dialog',
  standalone: false,
  templateUrl: './prodotto-dialog.html',
  styleUrl: './prodotto-dialog.css',
})
export class ProdottoDialog implements OnInit{

  prodotto = signal<any>(null);
  mod: any;
  selectedCategoria: String ;


  updateForm: FormGroup = new FormGroup({
    descrizione: new FormControl(null, Validators.required),
    productCode: new FormControl(null, Validators.required),
    colore: new FormControl(null, Validators.required),
    taglia: new FormControl(null, Validators.required),
    peso: new FormControl(null, Validators.required),
    quantita: new FormControl(null, Validators.required),
    categoria: new FormControl(null, Validators.required),
    produttore: new FormControl(null, Validators.required)

  })

  msg = signal('');
  constructor(
    private prodottoServices: ProdottoService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ProdottoDialog>
  ) {
    if (data) {
      this.prodotto.set(data.prodotto);
      this.mod = data.mode;

    }

  }

  ngOnInit(): void {
    if (this.mod == "U") {
      this.updateForm.patchValue({
        descrizione: this.prodotto().descrizione,
        productCode: this.prodotto().productCode,
        colore: this.prodotto().colore,
        taglia: this.prodotto().taglia,
        peso: this.prodotto().peso ,
        quantita: this.prodotto().quantita,
        categoria: this.prodotto().categoria,
        produttore: this.prodotto().produttore

      })
      this.updateForm.controls['productCode'].disable();
    }
  }

  get categorie() {
    return this.prodottoServices.categorie();
  }

  get produttori() {
    return this.prodottoServices.produttori();
  }

 onSubmit() {
    if (this.mod == 'C') this.onSubmitCreate();
    if (this.mod == 'U') this.onSubmitUpdate();
  }

  onSubmitUpdate() {
    this.msg.set('');
    const updateBody: any = { productCode: this.prodotto().productCode};

    if (this.updateForm.controls['descrizione'].dirty)
      updateBody.descrizione = this.updateForm.value.descrizione;

    if (this.updateForm.controls['colore'].dirty)
      updateBody.colore = this.updateForm.value.colore;

    if (this.updateForm.controls['taglia'].dirty)
      updateBody.taglia = this.updateForm.value.taglia;

    if (this.updateForm.controls['peso'].dirty)
      updateBody.peso = this.updateForm.value.peso;

    if (this.updateForm.controls['quantita'].dirty)
      updateBody.quantita = this.updateForm.value.quantita;

    if (this.updateForm.controls['categoria'].dirty)
      updateBody.categoriaId = this.updateForm.value.categoria.id;

    if (this.updateForm.controls['produttore'].dirty)
      updateBody.produttoreId = this.updateForm.value.produttore.id;



    console.log(updateBody);

    this.prodottoServices.update(updateBody)
      .subscribe({
        next: ((resp: any) => {
          console.log(resp);
          this.prodottoServices.list();
          this.dialogRef.close();
        }),
        error: ((resp: any) => {
          this.msg.set(resp.error.msg);
        })
      })
  }


  onSubmitCreate() {
    this.msg.set("");



    this.prodottoServices.create({
      descrizione: this.updateForm.value.descrizione,
      productCode: this.updateForm.value.productCode,
      colore: this.updateForm.value.colore,
      taglia: this.updateForm.value.taglia,
      peso: this.updateForm.value.peso ,
      quantita: this.updateForm.value.quantita,
      idCategoria: this.updateForm.value.categoria.id,
      idProduttore: this.updateForm.value.produttore.id

    }).subscribe({
      next: ((resp: any) => {
        console.log(resp);
        this.prodottoServices.list();
        this.dialogRef.close();
      }),
      error: ((resp: any) => {
        console.log(resp.error.msg)
        this.msg.set(resp.error.msg);
      })
    })
  }
}
