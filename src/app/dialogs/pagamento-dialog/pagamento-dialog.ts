import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pagamento-dialog',
  standalone: false,
  templateUrl: './pagamento-dialog.html',
  styleUrl: './pagamento-dialog.css',
})
export class PagamentoDialog {
  readonly dialog = inject(MatDialog);

  constructor(
    private dialogRef: MatDialogRef<PagamentoDialog>
  ) {

  }
}
