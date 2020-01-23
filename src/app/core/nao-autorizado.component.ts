import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagina-nao-encontrada',
  template: `
    <div class="container">
      <h1 class="text-center">Você não tem permissão para acessar esta página.</h1>
    </div>
  `,
  styles: []
})
export class NaoAutorizadoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
