import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProdottoService {
  private url = "http://localhost:9080/rest/prodotto/";
  private urlCat = "http://localhost:9080/rest/categoria/";
  private urlProd = "http://localhost:9080/rest/produttore/";
  prodotti = signal<any[]>([]);
  categorie = signal<any[]>([]);
  produttori = signal<any[]>([]);

  constructor(private http: HttpClient) { }

  list( categoria?: number, produttore?: number) {
    let params = new HttpParams();

    if (categoria) params = params.set('categoria', categoria);
    if (produttore) params = params.set('produttore', produttore);

    this.http.get(this.url + "list" , { params })
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
  produttoriList() {
    let params = new HttpParams();

    this.http.get(this.urlProd + "list" )//, { params })
      .subscribe({
        next: ((r: any) => this.produttori.set(r)),
      })

  }




}
