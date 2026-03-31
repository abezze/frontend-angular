import { Component, Inject, OnInit, signal } from '@angular/core';
import { ProduttoreService } from '../../services/produttore-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-produttore-dialog',
  standalone: false,
  templateUrl: './produttore-dialog.html',
  styleUrl: './produttore-dialog.css',
})
export class ProduttoreDialog implements OnInit {
  produttore = signal<any>(null);
  msg = signal('');
  mod: any;

  updateForm: FormGroup = new FormGroup({
//    id: new FormControl(null, Validators.required),
    codiceFiscale: new FormControl(null, Validators.required),
    partitaIva: new FormControl(null),
    marchio: new FormControl(null, Validators.required),
    nomeAzienda: new FormControl(null, Validators.required)
  });

  constructor(
    private produttoreServices: ProduttoreService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ProduttoreDialog>
  ) {
    if (data) {
      this.produttore.set(data.produttore);
      this.mod = data.mode;
    }

  }

  ngOnInit(): void {
    if (this.mod == "U") {
      this.updateForm.patchValue({
        codiceFiscale: this.produttore().codiceFiscale,
        partitaIva: this.produttore().partitaIva,
        marchio: this.produttore().marchio,
        nomeAzienda: this.produttore().nomeAzienda
      })

      //this.updateForm.markAllAsTouched();
      //this.updateForm.markAsDirty();
      //this.updateForm.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.mod == 'C') this.onSubmitCreate();
    if (this.mod == 'U') this.onSubmitUpdate();
  }

  onSubmitCreate() {
    this.msg.set("");
    
    this.produttoreServices.create({
      codiceFiscale: this.updateForm.value.codiceFiscale,
      partitaIva: this.updateForm.value.partitaIva,
      marchio: this.updateForm.value.marchio,
      nomeAzienda: this.updateForm.value.nomeAzienda
    }).subscribe({
      next: ((resp: any) => {
        console.log(resp);
        this.produttoreServices.produttoriList();
        this.dialogRef.close();
      }),
      error: ((resp: any) => {
        console.log(resp.error.msg)
        this.msg.set(resp.error.msg);
      })
    })
  }

  onSubmitUpdate() {
    this.msg.set("");
    
    this.produttoreServices.update({
      id: this.produttore().id,
      codiceFiscale: this.updateForm.value.codiceFiscale,
      partitaIva: this.updateForm.value.partitaIva,
      marchio: this.updateForm.value.marchio,
      nomeAzienda: this.updateForm.value.nomeAzienda
    }).subscribe({
      next: ((resp: any) => {
        console.log(resp);
        this.produttoreServices.produttoriList();
        this.dialogRef.close();
      }),
      error: ((resp: any) => {
        console.log(resp.error.msg)
        this.msg.set(resp.error.msg);
      })
    })
  }

}
