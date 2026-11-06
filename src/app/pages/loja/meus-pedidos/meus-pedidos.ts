import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AtendimentoService } from '../../../services/atendimento.service';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container my-4">
      <h2 class="mb-4">Consultar Meus Pedidos</h2>

      <div class="card shadow-sm p-4 mb-4 bg-light">
        <div class="row align-items-end g-3">
          <div class="col-md-8">
            <label class="form-label fw-bold">Selecione o Cliente para Visualizar o Histórico:</label>
            <select class="form-select form-select-lg" [(ngModel)]="clienteSelecionadoId">
              <option [value]="0">-- Selecione um Cliente --</option>
              <option *ngFor="let c of listaClientes()" [value]="getIdCliente(c)">
                #{{ getIdCliente(c) }} - {{ getNomeCliente(c) }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <button class="btn btn-primary btn-lg w-100" (click)="filtrarPedidos()" [disabled]="carregando()">
              {{ carregando() ? 'Buscando...' : 'Filtrar Pedidos' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Alerta quando nenhum cliente foi selecionado -->
      <div *ngIf="!buscaRealizada()" class="alert alert-info shadow-sm text-center py-4">
        <h5>Selecione um cliente acima para consultar os pedidos realizados.</h5>
      </div>

      <!-- Tabela/Cards de Pedidos -->
      <div *ngIf="buscaRealizada()">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4>Histórico de Pedidos ({{ pedidosFiltrados().length }})</h4>
        </div>

        <div *ngIf="pedidosFiltrados().length === 0" class="alert alert-warning text-center py-4">
          Nenhum pedido localizado para o cliente selecionado.
        </div>

        <div *ngFor="let pedido of pedidosFiltrados()" class="card shadow-sm mb-4">
          <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <div>
              <strong>Pedido #{{ getIdPedido(pedido) }}</strong>
              <span class="ms-3 text-light text-muted">| Data: {{ getDataPedido(pedido) }}</span>
            </div>
            <div>
              <span class="badge" [ngClass]="getBadgeClass(getSituacaoPedido(pedido))">
                {{ getSituacaoPedido(pedido) }}
              </span>
            </div>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted">Itens do Pedido:</h6>
            <div class="table-responsive">
              <table class="table table-sm table-bordered align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Item / Produto / Serviço</th>
                    <th class="text-center">Quantidade</th>
                    <th class="text-end">Preço Unitário</th>
                    <th class="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of getItensPedido(pedido)">
                    <td>{{ getNomeItem(item) }}</td>
                    <td class="text-center">{{ getQuantidadeItem(item) }}</td>
                    <td class="text-end">R$ {{ getPrecoItem(item) | number:'1.2-2' }}</td>
                    <td class="text-end fw-bold">R$ {{ (getQuantidadeItem(item) * getPrecoItem(item)) | number:'1.2-2' }}</td>
                  </tr>
                  <tr *ngIf="getItensPedido(pedido).length === 0">
                    <td colspan="4" class="text-center text-muted">Nenhum item detalhado.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-end align-items-center mt-3">
              <h5 class="mb-0 text-primary">Total do Pedido: <strong>R$ {{ getTotalPedido(pedido) | number:'1.2-2' }}</strong></h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MeusPedidosComponent implements OnInit {
  private http = inject(HttpClient);
  private atendimentoService = inject(AtendimentoService, { optional: true });

  listaClientes = signal<any[]>([]);
  todosPedidos = signal<any[]>([]);
  pedidosFiltrados = signal<any[]>([]);
  clienteSelecionadoId: number = 0;
  carregando = signal<boolean>(false);
  buscaRealizada = signal<boolean>(false);

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando.set(true);

    const processarPedidos = (pedidos: any[]) => {
      const lista = pedidos || [];
      this.todosPedidos.set(lista);
      this.extrairClientesDosPedidos(lista);
      this.carregarClientesViaApiExplicita();
      this.carregando.set(false);
    };

    if (this.atendimentoService) {
      const serviceAny = this.atendimentoService as any;
      const getObs = serviceAny.getAtendimentos ? serviceAny.getAtendimentos() :
                     serviceAny.getPedidos ? serviceAny.getPedidos() : null;

      if (getObs && typeof getObs.subscribe === 'function') {
        getObs.subscribe({
          next: (res: any[]) => processarPedidos(res),
          error: (err: any) => {
            console.error('Erro no AtendimentoService:', err);
            this.tentarHttpDireto(processarPedidos);
          }
        });
        return;
      }
    }

    this.tentarHttpDireto(processarPedidos);
  }

  private tentarHttpDireto(callback: (pedidos: any[]) => void): void {
    const baseUrl = this.obterBaseApiUrl();
    this.http.get<any[]>(`${baseUrl}/api/Atendimento`).subscribe({
      next: (res: any[]) => callback(res),
      error: () => {
        this.http.get<any[]>('/api/Atendimento').subscribe({
          next: (res: any[]) => callback(res),
          error: (err: any) => {
            console.error('Erro ao buscar atendimentos via HTTP:', err);
            this.carregando.set(false);
          }
        });
      }
    });
  }

  private carregarClientesViaApiExplicita(): void {
    const baseUrl = this.obterBaseApiUrl();
    const endpointPessoas = `${baseUrl}/api/PessoaEndereco`;

    this.http.get<any[]>(endpointPessoas).subscribe({
      next: (res: any[]) => {
        if (res && res.length > 0) {
          const clientesAtuais = [...this.listaClientes()];
          res.forEach(p => {
            const id = this.getIdCliente(p);
            if (id && !clientesAtuais.some(c => this.getIdCliente(c) === id)) {
              clientesAtuais.push(p);
            }
          });
          this.listaClientes.set(clientesAtuais);
        }
      },
      error: () => {
        // Fallback silencioso mantendo os clientes extraídos dos atendimentos
      }
    });
  }

  private obterBaseApiUrl(): string {
    if (this.atendimentoService) {
      const url = (this.atendimentoService as any).apiUrl || (this.atendimentoService as any).url || '';
      if (url && url.includes('http')) {
        const match = url.match(/^(https?:\/\/[^\/]+)/);
        if (match) return match[1];
      }
    }
    return '';
  }

  private extrairClientesDosPedidos(pedidos: any[]): void {
    const clientesMap = new Map<number, any>();

    pedidos.forEach(p => {
      const id = Number(p.idpessoa ?? p.idPessoa ?? p.idcliente ?? p.idCliente ?? p.pessoa?.idpessoa ?? p.idpessoaNavigation?.idpessoa ?? 0);
      const nome = p.nomePessoa ?? p.nomeCliente ?? p.pessoa1 ?? p.pessoa?.nomePessoa ?? p.idpessoaNavigation?.nomePessoa ?? p.cliente ?? null;

      if (id > 0 && !clientesMap.has(id)) {
        clientesMap.set(id, {
          idpessoa: id,
          nomePessoa: nome || `Cliente #${id}`
        });
      }
    });

    const clientesExtraidos = Array.from(clientesMap.values());
    if (clientesExtraidos.length > 0) {
      this.listaClientes.set(clientesExtraidos);
    }
  }

  filtrarPedidos(): void {
    const id = Number(this.clienteSelecionadoId);
    if (!id || id <= 0) {
      alert('Selecione um cliente para filtrar!');
      return;
    }

    this.buscaRealizada.set(true);

    const filtrados = this.todosPedidos().filter((p: any) => {
      const idPedCliente = Number(p.idpessoa ?? p.idPessoa ?? p.idcliente ?? p.idCliente ?? p.pessoa?.idpessoa ?? p.idpessoaNavigation?.idpessoa ?? 0);
      return idPedCliente === id;
    });

    this.pedidosFiltrados.set(filtrados);
  }

  getIdCliente(c: any): number {
    if (!c) return 0;
    return Number(c.idpessoa ?? c.idPessoa ?? c.idcliente ?? c.idCliente ?? c.id ?? 0);
  }

  getNomeCliente(c: any): string {
    if (!c) return 'Cliente';
    if (c.nomePessoa) return c.nomePessoa;
    if (c.nome) return c.nome;
    if (c.pessoa1) return c.pessoa1;
    if (c.nomeCliente) return c.nomeCliente;
    if (c.idpessoaNavigation?.nomePessoa) return c.idpessoaNavigation.nomePessoa;
    const id = this.getIdCliente(c);
    return id ? `Cliente #${id}` : 'Cliente sem nome';
  }

  getIdPedido(p: any): number | string {
    if (!p) return '-';
    return p.idatendimento ?? p.idAtendimento ?? p.idpedido ?? p.idPedido ?? p.id ?? '-';
  }

  getDataPedido(p: any): string {
    if (!p) return '-';
    const rawDate = p.dataAtendimento ?? p.dataHora ?? p.dataPedido ?? p.data;
    if (!rawDate) return '-';
    try {
      return new Date(rawDate).toLocaleDateString('pt-BR');
    } catch {
      return String(rawDate);
    }
  }

  getSituacaoPedido(p: any): string {
    if (!p) return 'Em Aberto';
    return p.situacaoAtendimento ?? p.situacao ?? p.status ?? 'Concluído';
  }

  getBadgeClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s.includes('conclu') || s.includes('pago') || s.includes('finaliz')) return 'bg-success';
    if (s.includes('cancel')) return 'bg-danger';
    return 'bg-warning text-dark';
  }

  getItensPedido(p: any): any[] {
    if (!p) return [];
    return p.atendimentoitems ?? p.atendimentoItems ?? p.itens ?? p.items ?? [];
  }

  getNomeItem(item: any): string {
    if (!item) return 'Item';
    const nav = item.iditemNavigation || item.idItemNavigation;
    if (nav?.item1) return nav.item1;
    if (nav?.nomeItem) return nav.nomeItem;
    if (item.item1) return item.item1;
    if (item.nomeItem) return item.nomeItem;
    const id = item.iditem ?? item.idItem ?? 0;
    return id ? `Item #${id}` : 'Item de Pedido';
  }

  getQuantidadeItem(item: any): number {
    if (!item) return 1;
    return Number(item.quantidade ?? item.qtde ?? item.quantidadeItem ?? 1);
  }

  getPrecoItem(item: any): number {
    if (!item) return 0;
    return Number(item.precoUnitario ?? item.preco ?? item.valorUnitario ?? item.iditemNavigation?.preco ?? 0);
  }

  getTotalPedido(p: any): number {
    if (!p) return 0;
    if (p.valorTotal !== undefined && p.valorTotal !== null) return Number(p.valorTotal);
    if (p.total !== undefined && p.total !== null) return Number(p.total);

    const itens = this.getItensPedido(p);
    if (itens.length > 0) {
      return itens.reduce((acc, it) => acc + (this.getQuantidadeItem(it) * this.getPrecoItem(it)), 0);
    }
    return 0;
  }
}

export { MeusPedidosComponent as MeusPedidos };