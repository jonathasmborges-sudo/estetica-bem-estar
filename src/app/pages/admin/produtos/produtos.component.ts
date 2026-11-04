import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../../services/produto.service';
import { CategoriaService } from '../../../services/categoria.service';
import { ProdutoBackendResponse } from '../../../models/produto.model';
import { Categorium } from '../../../models/categoria.model';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestão de Produtos e Serviços</h2>
        <button class="btn btn-primary" (click)="novoItem()">+ Novo Item</button>
      </div>

      <div *ngIf="exibirFormulario()" class="card shadow-sm mb-4 p-3 bg-light">
        <h4>{{ editandoId() ? 'Editar Item' : 'Cadastrar Item' }}</h4>
        <form (ngSubmit)="salvar()">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Nome do Item (*)</label>
              <input type="text" class="form-control" [(ngModel)]="formItem.item1" name="item1" required>
            </div>
            <div class="col-md-4">
              <label class="form-label">Categoria (*)</label>
              <select class="form-select" [(ngModel)]="formItem.idcategoria" name="idcategoria" required>
                <option [value]="0">-- Selecione --</option>
                <option *ngFor="let c of categorias()" [value]="c.idcategoria">{{ c.categoria }}</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Tipo (*)</label>
              <select class="form-select" [(ngModel)]="formItem.tipoItem" name="tipoItem" required>
                <option value="P">Produto</option>
                <option value="S">Serviço</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Preço Venda (*)</label>
              <input type="number" step="0.01" class="form-control" [(ngModel)]="formItem.precoVenda" name="precoVenda" required>
            </div>
            <div class="col-md-8">
              <label class="form-label">Descrição</label>
              <input type="text" class="form-control" [(ngModel)]="formItem.descricaoItem" name="descricaoItem">
            </div>
            <div class="col-md-2">
              <label class="form-label">Unidade</label>
              <input type="text" class="form-control" [(ngModel)]="formItem.unidade" name="unidade" placeholder="UN, CX, etc">
            </div>
            <div class="col-md-2">
              <label class="form-label">Situação</label>
              <select class="form-select" [(ngModel)]="formItem.ativoProdutoServico" name="ativoProdutoServico">
                <option value="S">Ativo</option>
                <option value="N">Inativo</option>
              </select>
            </div>
          </div>
          <div class="mt-3">
            <button type="submit" class="btn btn-success me-2">Salvar</button>
            <button type="button" class="btn btn-secondary" (click)="exibirFormulario.set(false)">Cancelar</button>
          </div>
        </form>
      </div>

      <table class="table table-striped align-middle mt-3">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Preço Venda</th>
            <th>Unidade</th>
            <th>Situação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of produtos()">
            <td>#{{ p.iditem }}</td>
            <td><strong>{{ p.iditemNavigation?.item1 }}</strong></td>
            <td>{{ obterNomeCategoria(p.iditemNavigation?.idcategoria) }}</td>
            <td>
              <span class="badge" [ngClass]="p.iditemNavigation?.tipoItem === 'P' ? 'bg-info text-dark' : 'bg-success'">
                {{ p.iditemNavigation?.tipoItem === 'P' ? 'Produto' : 'Serviço' }}
              </span>
            </td>
            <td>R$ {{ p.precoVenda | number:'1.2-2' }}</td>
            <td>{{ p.unidade || 'UN' }}</td>
            <td>
              <span class="badge" [ngClass]="p.iditemNavigation?.ativoProdutoServico === 'N' ? 'bg-secondary' : 'bg-primary'">
                {{ p.iditemNavigation?.ativoProdutoServico === 'N' ? 'Inativo' : 'Ativo' }}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" (click)="editar(p)">Editar</button>
              <button class="btn btn-sm btn-outline-danger" (click)="excluir(p.iditem)">Excluir/Desativar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ProdutosComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);

  produtos = signal<ProdutoBackendResponse[]>([]);
  categorias = signal<Categorium[]>([]);
  exibirFormulario = signal<boolean>(false);
  editandoId = signal<number | null>(null);

  formItem: any = {
    item1: '',
    descricaoItem: '',
    idcategoria: 0,
    tipoItem: 'P',
    ativoProdutoServico: 'S',
    precoVenda: 0,
    unidade: 'UN'
  };

  ngOnInit(): void {
    this.carregar();
    this.categoriaService.getCategorias().subscribe({ next: (res) => this.categorias.set(res) });
  }

  carregar(): void {
    this.produtoService.getProdutos().subscribe({ next: (res) => this.produtos.set(res) });
  }

  obterNomeCategoria(idcat?: number): string {
    const cat = this.categorias().find(c => c.idcategoria === Number(idcat));
    return cat ? cat.categoria : '-';
  }

  novoItem(): void {
    this.formItem = { item1: '', descricaoItem: '', idcategoria: 0, tipoItem: 'P', ativoProdutoServico: 'S', precoVenda: 0, unidade: 'UN' };
    this.editandoId.set(null);
    this.exibirFormulario.set(true);
  }

  editar(p: ProdutoBackendResponse): void {
    this.formItem = {
      item1: p.iditemNavigation?.item1 || '',
      descricaoItem: p.iditemNavigation?.descricaoItem || '',
      idcategoria: p.iditemNavigation?.idcategoria || 0,
      tipoItem: p.iditemNavigation?.tipoItem || 'P',
      ativoProdutoServico: p.iditemNavigation?.ativoProdutoServico || 'S',
      precoVenda: p.precoVenda,
      unidade: p.unidade || 'UN'
    };
    this.editandoId.set(p.iditem);
    this.exibirFormulario.set(true);
  }

  salvar(): void {
    if (!this.formItem.item1.trim()) {
      alert('Informe o nome do item!');
      return;
    }
    if (Number(this.formItem.idcategoria) <= 0) {
      alert('Selecione uma categoria válida!');
      return;
    }

    const payload = {
      ...this.formItem,
      idcategoria: Number(this.formItem.idcategoria),
      precoVenda: Number(this.formItem.precoVenda)
    };

    if (this.editandoId()) {
      this.produtoService.updateProduto(this.editandoId()!, payload).subscribe({
        next: () => {
          this.exibirFormulario.set(false);
          this.carregar();
        },
        error: (err) => alert('Erro ao atualizar item: ' + (err?.error?.title || err?.statusText || 'Erro na requisição'))
      });
    } else {
      this.produtoService.createProduto(payload).subscribe({
        next: () => {
          this.exibirFormulario.set(false);
          this.carregar();
        },
        error: (err) => alert('Erro ao cadastrar item: ' + (err?.error?.title || err?.statusText || 'Erro na requisição'))
      });
    }
  }

  excluir(id: number): void {
    if (confirm('Deseja excluir ou desativar este item?')) {
      this.produtoService.deleteProduto(id).subscribe({
        next: () => this.carregar(),
        error: (err) => alert('Erro ao excluir item: ' + (err?.error?.title || err?.statusText || 'Erro na requisição'))
      });
    }
  }
}