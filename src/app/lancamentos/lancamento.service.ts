import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import * as moment from 'moment';
import { Lancamento } from '../core/model';
import { environment } from 'src/environments/environment';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  apiUrl: string;



  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}/lancamentos`;
  }

  headers(): HttpHeaders {
    return new HttpHeaders();
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    let headers = this.headers();
    headers = headers.append('Content-Type', 'application/json');

    return this.http.post<Lancamento>(`${this.apiUrl}`, lancamento, {headers}).toPromise();
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {

    let params = new HttpParams();
    const headers = this.headers();

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }
    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }
    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }
    return this.http.get(`${this.apiUrl}?resumo`, { headers, params })
      .toPromise()
      .then(response => {
        const lancamentos = response['content'];
        const resultado = {
          lancamentos,
          total: response['totalElements']
        };
        return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {
    const headers = this.headers();
    return this.http.delete(`${this.apiUrl}/${codigo}`, {headers})
    .toPromise().then(() => null);
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    let headers = this.headers();
    headers = headers.append('Content-Type', 'application/json');

    return this.http.put<Lancamento>(`${this.apiUrl}/${lancamento.codigo}`, lancamento, {headers}).toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {

    const headers = this.headers();

    return this.http.get<Lancamento>(`${this.apiUrl}/${codigo}`, { headers })
      .toPromise().then(lancamento => {
        this.converterStringsParaDatas([lancamento]);
        return lancamento;
      });
  }

  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    lancamentos.forEach(lancamento => {
      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento).toDate();
      }
      if (lancamento.dataVencimento) {
        lancamento.dataVencimento = moment(lancamento.dataVencimento).toDate();
      }
    });
  }

}
