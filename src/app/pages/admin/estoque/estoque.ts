import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstoqueService, EstoqueDTO, EntradaProdutoDTO } from '../../../services/estoque';
import { ProdutoService } from '../../../services/produto.service';
import { ProdutoBackendResponse } from '../../../models/produto.model';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Controle & Entradas de Estoque</h2>
        <button class="btn btn-success" (click)="exibirModalEntrada.set(!exibirModalEntrada())">
          {{ exibirModalEntrada() ? 'Fechar Formulário' : '+ Dar Entrada de Produto' }}
        </button>
      </div>

      <div *ngIf="exibirModalEntrada()" class="card shadow-sm p-4 mb-4 bg-light">
        <h4>Registrar Entrada de Mercadoria</h4>
        <form (ngSubmit)="salvarEntrada()">
          <div class="row g-3 mt-1">
            <div class="col-md-4">
              <label class="form-label">Produto (*)</label>
              <select class="form-select" [(ngModel)]="novaEntrada.iditem" name="iditem" required>
                <option [value]="0">-- Selecione o Produto --</option>
                <option *ngFor="let p of listaProdutos()" [value]="p.iditem">
                  #{{ p.iditem }} - {{ p.iditemNavigation?.item1 }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Quantidade (*)</label>
              <input type="number" class="form-control" [(ngModel)]="novaEntrada.quantidadeEntrada" name="quantidadeEntrada" min="1" required>
            </div>
            <div class="col-md-2">
              <label class="form-label">Unidade</label>
              <input type="text" class="form-control" [(ngModel)]="novaEntrada.unidade" name="unidade" placeholder="UN, CX, KG">
            </div>
            <div class="col-md-2">
              <label class="form-label">Valor Unitário (R$) (*)</label>
              <input type="number" step="0.01" class="form-control" [(ngModel)]="novaEntrada.valorUnitarioEntrada" name="valorUnitarioEntrada" required>
            </div>
            <div class="col-md-2">
              <label class="form-label">Data Entrada</label>
              <input type="date" class="form-control" [(ngModel)]="novaEntrada.dataEntradaProduto" name="dataEntradaProduto" required>
            </div>
          </div>
          <div class="mt-3">
            <button type="submit" class="btn btn-primary me-2" [disabled]="salvando()">
              {{ salvando() ? 'Registrando...' : 'Confirmar Entrada' }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="exibirModalEntrada.set(false)">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="row mb-3">
        <div class="col-md-4">
          <div class="input-group">
            <input type="number" class="form-control" placeholder="Buscar por ID do Item..." [(ngModel)]="filtroIdItem">
            <button class="btn btn-outline-secondary" (click)="filtrarPorId()">Buscar</button>
            <button class="btn btn-outline-dark" (click)="limparFiltro()">Limpar</button>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped align-middle">
          <thead class="table-dark">
            <tr>
              <th>ID Item</th>
              <th>Produto</th>
              <th>Descrição</th>
              <th>Preço Venda</th>
              <th>Unidade</th>
              <th>Qtde em Estoque</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of listaEstoque()">
              <td>#{{ item.iditem }}</td>
              <td><strong>{{ item.iditemNavigation?.item1 || 'Item #' + item.iditem }}</strong></td>
              <td>{{ item.iditemNavigation?.descricaoItem || '-' }}</td>
              <td>R$ {{ (item.precoVenda || 0) | number:'1.2-2' }}</td>
              <td>{{ item.unidade || 'UN' }}</td>
              <td>
                <span class="badge" [ngClass]="item.quantidadeEstoque > 5 ? 'bg-success' : 'bg-danger'">
                  {{ item.quantidadeEstoque }} unidade(s)
                </span>
              </td>
              <td>
                <span class="badge bg-secondary">
                  {{ item.iditemNavigation?.ativoItem === 'N' ? 'Inativo' : 'Ativo' }}
                </span>
              </td>
            </tr>
            <tr *ngIf="listaEstoque().length === 0">
              <td colspan="7" class="text-center py-3 text-muted">Nenhum registro de estoque localizado.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class EstoqueComponent implements OnInit {
  private estoqueService = inject(EstoqueService);
  private produtoService = inject(ProdutoService);

  listaEstoque = signal<EstoqueDTO[]>([]);
  listaProdutos = signal<ProdutoBackendResponse[]>([]);
  exibirModalEntrada = signal<boolean>(false);
  salvando = signal<boolean>(false);
  filtroIdItem: number | null = null;

  novaEntrada: EntradaProdutoDTO = {
    iditem: 0,
    quantidadeEntrada: 1,
    unidade: 'UN',
    valorUnitarioEntrada: 0,
    dataEntradaProduto: new Date().toISOString().split('T')[0]
  };

  ngOnInit(): void {
    this.carregarEstoque();
    this.carregarProdutos();
  }

  carregarEstoque(): void {
    this.estoqueService.getEstoque().subscribe({
      next: (res) => this.listaEstoque.set(res),
      error: (err) => console.error('Erro ao carregar estoque:', err)
    });
  }

  carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: (res) => this.listaProdutos.set(res.filter(p => p.iditemNavigation?.tipoItem === 'P')),
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  filtrarPorId(): void {
    if (!this.filtroIdItem || this.filtroIdItem <= 0) {
      this.carregarEstoque();
      return;
    }
    this.estoqueService.getEstoquePorId(Number(this.filtroIdItem)).subscribe({
      next: (res) => this.listaEstoque.set(res ? [res] : []),
      error: () => alert('Item não localizado no estoque (404 Not Found).')
    });
  }

  limparFiltro(): void {
    this.filtroIdItem = null;
    this.carregarEstoque();
  }

  salvarEntrada(): void {
    if (this.novaEntrada.iditem <= 0) {
      alert('Selecione um produto válido!');
      return;
    }
    if (this.novaEntrada.quantidadeEntrada <= 0 || this.novaEntrada.valorUnitarioEntrada <= 0) {
      alert('Informe uma quantidade e um valor unitário válidos!');
      return;
    }

    this.salvando.set(true);
    this.estoqueService.registrarEntrada(this.novaEntrada).subscribe({
      next: () => {
        alert('Entrada de mercadoria registrada com sucesso!');
        this.salvando.set(false);
        this.exibirModalEntrada.set(false);
        this.carregarEstoque();
      },
      error: (err) => {
        console.error('Erro ao registrar entrada:', err);
        alert('Erro ao registrar entrada no estoque.');
        this.salvando.set(false);
      }
    });
  }
}

export { EstoqueComponent as Estoque };