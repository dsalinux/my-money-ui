import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}/categorias`;
  }

  headers(): HttpHeaders {
    return new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
  }


  listarTodas(): Promise<any> {
    const headers = this.headers();
    return this.http.get(`${this.apiUrl}`, { headers })
      .toPromise()
      .then(response => {
          return response;
      });
  }
}
