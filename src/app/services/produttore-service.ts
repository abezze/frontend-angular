import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProduttoreService {
   private urlProd = "http://localhost:9080/rest/produttore/";
   produttori = signal<any[]>([]);

   constructor(private http: HttpClient) { }

   produttoriList() {
    let params = new HttpParams();

    this.http.get(this.urlProd + "list" )//, { params })
      .subscribe({
        next: ((r: any) => this.produttori.set(r)),
      })

  }

}
