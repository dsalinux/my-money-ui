import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenRevokeUrl: string;
  oauthTokenUrl: string;
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService
    ) {
      this.tokenRevokeUrl = `${environment.apiUrl}/tokens/revoke`;
      this.oauthTokenUrl = `${environment.apiUrl}/oauth/token`;
      this.carregarToken();
     }

  login(email: string, password: string): Promise<void> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjphbmd1bGFy');
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body = `client: angular&username=${email}&password=${password}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true }).toPromise()
    .then(response => {
      this.armazenarToken(response['access_token']);
    }).catch(response => {
      const responseError = response.error;
      if (response.status === 400) {
        if (responseError.error === 'invalid_grant') {
          return Promise.reject('E-mail ou senha inválidos.');
        }
        return Promise.reject(response);
      }
    });
  }

  obterNovoAccessToken(): Promise<void> {
    console.log('NOVO TOKEN SOLICITADO');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjphbmd1bGFy');
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body = 'grant_type=refresh_token';
    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true  }).toPromise()
    .then(response => {
      this.armazenarToken(response['access_token']);
    }).catch(error => {
      console.log('Erro ao renovar o token.', error);
      return  Promise.resolve(null);
    });
  }

  removeAccessToken() {
    console.log('removendo accessToken');
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  logout() {
    return this.http.delete(this.tokenRevokeUrl, { withCredentials: true })
    .toPromise()
    .then(() => {
      this.removeAccessToken();
    });
  }

  isAccessTokenInvalid() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelperService.isTokenExpired(token);
  }

  hasPermission(permission: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permission);
  }

  hasAnyPermission(roles: []) {
    console.log(roles);
    for (const role of roles) {
      if (this.hasPermission(role)) {
        return true;
      }
    }
    return false;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelperService.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

}
