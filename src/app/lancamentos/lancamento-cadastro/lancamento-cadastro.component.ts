import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/categorias/categorias.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { PessoaService } from 'src/app/pessoa/pessoa.service';
import { Lancamento } from 'src/app/core/model';
import { FormControl } from '@angular/forms';
import { LancamentoService } from '../lancamento.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    {label: 'Receita', value: 'RECEITA'},
    {label: 'Despesa', value: 'DESPESA'}
  ];

  categorias = [ ];
  pessoas = [ ];
  lancamento = new Lancamento();

  constructor(
    private lancamentoService: LancamentoService,
    private categoriaService: CategoriasService,
    private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private routeActiviate: ActivatedRoute,
    private router: Router,
    private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Novo Lançamento');
    const codigo = this.routeActiviate.snapshot.params['codigo'];
    if (codigo) {
      this.carregarLancamento(codigo);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento =>  {
        this.lancamento = lancamento;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarLancamento(form);
    } else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento).then(
      lancamentoAdicionado => {
        this.messageService.add({severity: 'success', summary: 'Adicionado com sucesso.'});
        // form.reset();
        // this.lancamento = new Lancamento();
        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
      }).catch(e => {
        this.errorHandler.handle(e);
      });
  }

  atualizarLancamento(form: FormControl) {
    this.lancamentoService.atualizar(this.lancamento)
      .then(lancamento => {
        this.lancamento = lancamento;
        this.messageService.add({severity: 'success', summary: 'Atualizado com sucesso.'});
        this.atualizarTituloEdicao();
      }).catch(e => this.errorHandler.handle(e));
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas().then(categorias => {
      this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo}));
    }).catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    return this.pessoaService.listarTodas().then(pessoas => {
      this.pessoas = pessoas.map(c => ({ label: c.nome, value: c.codigo}));
    }).catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();
    setTimeout(() => {
      this.lancamento = new Lancamento();
    }, 1);
    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Editando Lançamento: ${this.lancamento.descricao}`);
  }
}
