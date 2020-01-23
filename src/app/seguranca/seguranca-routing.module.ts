import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  // { path: 'pessoas/novo', component: PessoaCadastroComponent },
  // { path: 'pessoas/:codigo', component: PessoaCadastroComponent },
  ];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class SegurancaRoutingModule { }
