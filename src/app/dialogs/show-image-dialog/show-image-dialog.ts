import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-image-dialog',
  standalone: false,
  templateUrl: './show-image-dialog.html',
  styleUrl: './show-image-dialog.css',
})
export class ShowImageDialog {
  image:any;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data) {
      this.image = data.image;
    }
  }

}
