import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProduttoreService {
   private url = "http://localhost:9080/rest/produttore/";
   produttori = signal<any[]>([]);

   constructor(private http: HttpClient) { }

   produttoriList() {
    let params = new HttpParams();

    this.http.get(this.url + "list" )//, { params })
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

  delete(id:{}){
    console.log("delete: ", id);
    this.http.delete(this.url + "delete/" + id).subscribe({
      next: () => {
        console.log('Deleted successfully');
        this.produttoriList();
      },
      error: err => console.error('Error deleting: ', err)
    });
  }

}
