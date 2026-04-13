import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndirizzoSpedizioneService {
  private url = "http://localhost:9080/rest/indirizzoSpedizione/";

  constructor(private http: HttpClient) { }

  create(body:{}){
    console.log(body);
    return this.http.post(this.url+ "create", body);
  }
}
