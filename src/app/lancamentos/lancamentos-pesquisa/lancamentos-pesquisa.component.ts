import { Component, OnInit, ViewChild } from '@angular/core';
import { LancamentoService, LancamentoFiltro } from '../lancamento.service';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { DataTable } from 'primeng/components/datatable/datatable';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/seguranca/auth.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  lancamentos = [];
  filtro = new LancamentoFiltro();
  @ViewChild('tabela') tabela: DataTable;

  constructor(private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService,
    private title: Title) {}

  ngOnInit() {
    this.title.setTitle('Pesquisa de Lançamentos');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.lancamentoService.pesquisar(this.filtro).then(
      (resultado) => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      }
    ).catch(error => this.errorHandler.handle(error));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  excluir(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.confirmarExclusao(lancamento);
      }
    });
  }
  confirmarExclusao(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo).then(() => {
      this.tabela.reset();
      this.messageService.add({severity: 'success', summary: 'Excluído com sucesso.'});
    }).catch(error => this.errorHandler.handle(error));
  }
}
