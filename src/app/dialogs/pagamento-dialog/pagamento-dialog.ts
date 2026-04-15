import { ChangeDetectorRef, Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TipoPagamento } from '../../models/tipo-pagamento';
import { TipoPagamentoService } from '../../services/tipo-pagamento-service';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { OrdineService } from '../../services/ordine-service';
import { Router } from '@angular/router';
import { PagamentoService } from '../../services/pagamento-service';

@Component({
  selector: 'app-pagamento-dialog',
  standalone: false,
  templateUrl: './pagamento-dialog.html',
  styleUrl: './pagamento-dialog.css',
})
export class PagamentoDialog implements OnInit {
  readonly dialog = inject(MatDialog);

  tipiPagamentoList$!: Observable<any[]>;
  tipoPagamentoId: number;
  totale: number;
  ordine: any;

  pagamentoForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    amount: new FormControl(null, Validators.required),
    tipoPagamentoId: new FormControl(null, Validators.required),
    ordineId: new FormControl(null, Validators.required)
  });

  mostraInputCartaDiCredito = false;
  mostraInputPayPal = false;
  mostraInputBonificoBancario = false;

  constructor(
    private dialogRef: MatDialogRef<PagamentoDialog>,
    private tipoPagamentoS: TipoPagamentoService,
    private ordineS: OrdineService,
    private pagamentoS: PagamentoService,
    private routing: Router,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data) {
      this.pagamentoForm.patchValue({
        amount: this.data.totale,
        ordineId: this.data.ordine.id
      });

      this.totale = this.data.totale;
      this.ordine = this.data.ordine;
    }
  }

  ngOnInit(): void {/*
    this.tipoPagamentoS.list().subscribe(resp => {
      this.tipiPagamentoList = resp;
    });*/
    this.tipiPagamentoList$ = this.tipoPagamentoS.list();
  }

  cambiaForm(tipoPagamentoId: number) {
    if (this.pagamentoForm.contains("nomeTitolareCarta")) this.pagamentoForm.removeControl("nomeTitolareCarta");
    if (this.pagamentoForm.contains("numeroCarta")) this.pagamentoForm.removeControl("numeroCarta");
    if (this.pagamentoForm.contains("dataScadenzaCarta")) this.pagamentoForm.removeControl("dataScadenzaCarta");
    if (this.pagamentoForm.contains("cvv")) this.pagamentoForm.removeControl("cvv");
    this.mostraInputCartaDiCredito = false;

    if (this.pagamentoForm.contains("nomeUtentePayPal")) this.pagamentoForm.removeControl("nomeUtentePayPal");
    if (this.pagamentoForm.contains("passwordPayPal")) this.pagamentoForm.removeControl("passwordPayPal");
    this.mostraInputPayPal = false;

    this.mostraInputBonificoBancario = false;

    if (tipoPagamentoId == 1) {
      this.pagamentoForm.addControl("nomeTitolareCarta", new FormControl(null, Validators.required));
      this.pagamentoForm.addControl("numeroCarta", new FormControl(null, Validators.required));
      this.pagamentoForm.addControl("dataScadenzaCarta", new FormControl(null, Validators.required));
      this.pagamentoForm.addControl("cvv", new FormControl(null, Validators.required));
      this.mostraInputCartaDiCredito = true;
    } else if (tipoPagamentoId == 2) {
      this.pagamentoForm.addControl("nomeUtentePayPal", new FormControl(null, Validators.required));
      this.pagamentoForm.addControl("passwordPayPal", new FormControl(null, Validators.required));
      this.mostraInputPayPal = true;
    } else if (tipoPagamentoId == 3) {
      this.mostraInputBonificoBancario = true;
    }

    this.pagamentoForm.updateValueAndValidity();
  }

  onSubmit() {
    let ordineDaAggiornare = structuredClone(this.ordine);
    ordineDaAggiornare.statoOrdine = "PAGATO";
    this.ordineS.update(ordineDaAggiornare).subscribe({
      next: () => {
        console.log("Ordine numero " + this.ordine.id + " aggiornato correttamente");
        this.pagamentoS.create({
          id: this.pagamentoForm.value.id,
          amount: this.pagamentoForm.value.amount,
          tipoPagamentoId: this.pagamentoForm.value.tipoPagamentoId,
          ordineId: this.pagamentoForm.value.ordineId
        }).subscribe({
          next: () => {
            alert("Pagamento avvenuto con successo");
            this.dialogRef.close(true);
            this.routing.navigate(['/dash/home']);
          },
          error: err => console.error("L'ordine numero " + this.ordine.id + " non è stato pagato", err)
        });
      },
      error: err => console.error("L'ordine numero " + this.ordine.id + " non è stato aggiornato", err)
    });
  }
}
