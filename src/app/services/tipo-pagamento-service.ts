import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoPagamento } from '../models/tipo-pagamento';

@Injectable({
  providedIn: 'root',
})
export class TipoPagamentoService {

  private url = "http://localhost:9080/rest/tipopagamento/";

  constructor(private http: HttpClient) {
    
  }

  list() {
    return this.http.get<TipoPagamento[]>(this.url + "list" );
  }
  
}
