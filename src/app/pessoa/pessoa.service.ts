import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Pessoa } from '../core/model';
import { environment } from 'src/environments/environment';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}/pessoas`;
  }

  headers(): HttpHeaders {
    return new HttpHeaders();
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams();
    const headers = this.headers();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.apiUrl}?resumo`, { headers, params })
      .toPromise()
      .then(response => {
        const pessoas = response['content'];
        const resultado = {
          pessoas,
          total: response['totalElements']
        };
        return resultado;
      });
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    let headers = this.headers();
    headers = headers.append('Content-Type', 'application/json');

    return this.http.post<Pessoa>(`${this.apiUrl}`, pessoa, { headers }).toPromise();
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    let headers = this.headers();
    headers = headers.append('Content-Type', 'application/json');

    return this.http.put<Pessoa>(`${this.apiUrl}/${pessoa.codigo}`, pessoa, { headers }).toPromise();
  }

  listarTodas(): Promise<any> {
    const headers = this.headers();
    return this.http.get(`${this.apiUrl}`, { headers })
    .toPromise()
    .then(response => {
      const pessoas = response['content'];
      return pessoas;
    });
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    const headers = this.headers();
    return this.http.get<Pessoa>(`${this.apiUrl}/${codigo}`, { headers })
    .toPromise();
  }

  excluir(codigo: number): Promise<void> {
    const headers = this.headers();
    return this.http.delete(`${this.apiUrl}/${codigo}`, {headers})
    .toPromise().then(() => null);
  }

  alternarStatus(codigo: number, status: boolean): Promise<void> {
    let headers = this.headers();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.put(`${this.apiUrl}/${codigo}/ativo`, status, {headers})
    .toPromise().then(() => null);
  }
}
