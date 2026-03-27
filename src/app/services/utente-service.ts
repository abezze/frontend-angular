import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtenteService {

  url = "http://localhost:9080/rest/utente/";
  urlAnag = "http://localhost:9080/rest/anagrafica/";
  utenti = signal<any[]>([]);

  constructor(private http:HttpClient){
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

  delete(userId: string){
    return this.http.delete(this.url + "delete/" + userId);
  }

  getUserAnags(userId: string){


    let params = new HttpParams().set('userName', userId);
    return this.http.get(this.url + "findByUserName", {params});

  }

  getTipiIndirizzi(){
    return this.http.get(this.urlAnag + "listTipoIndirizzo");
  }
  changePwd(body:{}){
    return this.http.put(this.url + "changePwd", body);
  }

  list() {
    let params = new HttpParams();

    this.http.get(this.url + "list" )//, { params })
      .subscribe({
        next: ((r: any) => this.utenti.set(r)),
      })

  }

}
