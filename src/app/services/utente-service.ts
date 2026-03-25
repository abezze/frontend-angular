import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServices } from '../auth/auth-services';

@Injectable({
  providedIn: 'root',
})
export class UtenteService {

  url = "http://localhost:9080/rest/utente/";
  urlAnag = "http://localhost:9080/rest/anagrafica/";

  constructor(private http:HttpClient, public auth:AuthServices){
  }

  login(body:{}){
      return this.http.post(this.url + "login", body);

    }
  create(body:{}){
    return this.http.post(this.urlAnag+ "create", body);
  }

  update(body:{}){
    return this.http.put(this.urlAnag + "update", body);
  }
  getUserAnags(){


    let params = new HttpParams().set('userName', this.auth.grant().userId);
    return this.http.get(this.url + "findByUserName", {params});

  }

  getTipiIndirizzi(){
    return this.http.get(this.urlAnag + "listTipoIndirizzo");
  }
  changePwd(body:{}){
    return this.http.put(this.url + "changePwd", body);
  }


}
