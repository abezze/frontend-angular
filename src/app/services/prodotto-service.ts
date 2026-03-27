import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProdottoService {
  private url = "http://localhost:9080/rest/prodotto/";
  private urlCat = "http://localhost:9080/rest/categoria/";
  prodotti = signal<any[]>([]);
  categorie = signal<any[]>([]);

  constructor(private http: HttpClient) { }

  list() {
    let params = new HttpParams();

    this.http.get(this.url + "list" )//, { params })
      .subscribe({
        next: ((r: any) => this.prodotti.set(r)),
      })

  }
  categorieList() {
    let params = new HttpParams();

    this.http.get(this.urlCat + "list" )//, { params })
      .subscribe({
        next: ((r: any) => this.categorie.set(r)),
      })

  }




}
