import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log(next.data.roles ? true : false);
      if (this.authService.isAccessTokenInvalid()) {
        console.log('Navegação com accessToken invalido.');
        return this.authService.obterNovoAccessToken()
        .then(() => {
          if (this.authService.isAccessTokenInvalid()) {
            this.router.navigate(['/login']);
            return false;
          }
        });
      }
      if (next.data.roles && !this.authService.hasAnyPermission(next.data.roles)) {
        this.router.navigate(['/nao-autorizado']);
        return false;
      }
      return true;
  }

}
