import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private url = "http://localhost:9080/rest/upload/";

  constructor(
    private http: HttpClient
  ) {}

  upload(file: File, id: any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id);

    return this.http.post(this.url + "image", formData);
  }
  
  getUrl(name: string) {
    let params = new HttpParams().set("filename", name);
    return this.http.get(this.url + "getUrl", { params });
  }

}
