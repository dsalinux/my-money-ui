import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { NotAuthenticatedError } from '../seguranca/money-http-interceptor';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private messageService: MessageService,
    private router: Router ) { }

  handle(errorResponse: any) {
    let msg: string;
    console.log(errorResponse);
    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    }  else if (errorResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou.';
      this.router.navigate(['/login']);
    } else if (errorResponse.status >= 400 || errorResponse.status <= 499) {
      try {
        msg = errorResponse.error.error_description;

        if (errorResponse.status === 403) {
          msg = 'Você não tem permissão para executar esta ação.';
        }
      } catch (e) { }
    } else {
      msg = 'Erro ao executar o serviço. Tente novamente.';
    }
    this.messageService.add({severity: 'error', summary: 'Erro', detail: msg, life: 6000});
    console.log('Ocorreu um erro.', errorResponse);
  }
}
