import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PagamentoService {

  url = "http://localhost:9080/rest/pagamento/";

  constructor(private http: HttpClient) {}

  create(body:{}){
    return this.http.post(this.url + "create", body);
  }
  
}
