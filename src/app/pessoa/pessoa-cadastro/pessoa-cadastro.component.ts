import { Component, OnInit } from '@angular/core';
import { Pessoa } from 'src/app/core/model';
import { FormControl } from '@angular/forms';
import { PessoaService } from '../pessoa.service';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();

  constructor(private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private title: Title,
    private routeActivated: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.title.setTitle('Nova Pessoa');
    const codigo = this.routeActivated.snapshot.params['codigo'];
    if (codigo) {
      this.carregarPessoa(codigo);
    }
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPorCodigo(codigo)
    .then(pessoa =>  {
      this.pessoa = pessoa;
      this.atualizarTituloEdicao();
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    this.pessoa.ativo = true;
    this.pessoaService.adicionar(this.pessoa).then(
      () => {
        this.messageService.add({severity: 'success', summary: 'Adicionado com sucesso.'});
        form.reset();
        this.pessoa = new Pessoa();
      }).catch(e => {
        this.errorHandler.handle(e);
      });
  }

  novo(form: FormControl) {
    form.reset();
    setTimeout(() => {
      this.pessoa = new Pessoa();
    }, 1);
    this.router.navigate(['/pessoas/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Editando ${this.pessoa.nome}`);
  }
}
