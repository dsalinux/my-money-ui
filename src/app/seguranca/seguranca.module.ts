import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { ButtonModule } from 'primeng/components/button/button';
import {PasswordModule} from 'primeng/password';

import { SegurancaRoutingModule } from './seguranca-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { MoneyHttpInterceptor } from './money-http-interceptor';
import { AuthGuard } from './auth.guard';
import { environment } from 'src/environments/environment';

export function tokenGetter(): string {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    SegurancaRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.whitelistedDomains,
        blacklistedRoutes: environment.blacklistedRoutes
      }
  })
  ],
  providers: [
    JwtHelperService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: MoneyHttpInterceptor,
        multi: true
    },
    AuthGuard
  ]
})
export class SegurancaModule { }

/*
whitelistedDomains: ['192.168.0.100:8080'],
blacklistedRoutes: [`http://192.168.0.100:8080/oauth/token`]
whitelistedDomains: [environment.apiUrl.substring(environment.apiUrl.indexOf('//') + 2)],
 blacklistedRoutes: [`${environment.apiUrl}/oauth/token`]
 */
