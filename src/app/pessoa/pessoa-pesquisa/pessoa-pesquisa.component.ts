import { Component, OnInit, ViewChild } from '@angular/core';
import { PessoaService, PessoaFiltro } from '../pessoa.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DataTable } from 'primeng/components/datatable/datatable';
import { AuthService } from 'src/app/seguranca/auth.service';

@Component({
  selector: 'app-pessoa-pesquisa',
  templateUrl: './pessoa-pesquisa.component.html',
  styleUrls: ['./pessoa-pesquisa.component.css']
})
export class PessoaPesquisaComponent implements OnInit {

  totalRegistros: number;
  pessoas  = [];
  filtro = new PessoaFiltro();
  @ViewChild('tabela') tabela: DataTable;

  ngOnInit(): void { }

  constructor(private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    public authService: AuthService) { }


  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.pessoaService.pesquisar(this.filtro).then(
      (resultado) => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      }
    );
  }
  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  excluir(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.confirmarExclusao(pessoa);
      }
    });
  }

  confirmarExclusao(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo).then(() => {
      this.tabela.reset();
       this.messageService.add({severity: 'success', summary: 'Excluído com sucesso.'});
    }).catch(error => this.errorHandler.handle(error));
  }

  alternarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;

    this.pessoaService.alternarStatus(pessoa.codigo, novoStatus).then(() => {
      const acao = novoStatus ? 'ativada' : 'desativada';
      pessoa.ativo = novoStatus;
      this.messageService.add({severity: 'success', summary: `Pessoa ${acao} com sucesso.`});
    }).catch(erro => this.errorHandler.handle(erro));
  }
}
