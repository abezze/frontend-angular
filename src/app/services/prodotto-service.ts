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

  create(body:{}){
    console.log(body);
    return this.http.post(this.url+ "create", body);
  }

  update(body:{}){
    console.log(body);
    return this.http.put(this.url + "update", body);
  }

  delete(productCode:{}){
    console.log(productCode);
/*
    return this.http.delete(`${this.url}delete/${productCode}`);

    return this.http.delete(this.url + "delete/" + productCode)
            .pipe(tap(()  => this.list()));
*/
            this.http.delete(this.url + "delete/" + productCode).subscribe({
              next: () => {
                console.log('Deleted successfully');
                this.list();
              },
              error: err => console.error('Error deleting:', err)
            });
  }




}
