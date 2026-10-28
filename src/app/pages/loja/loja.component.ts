import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { CategoriaService } from '../../services/categoria.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { ProdutoBackendResponse } from '../../models/produto.model';
import { Categorium } from '../../models/categoria.model';

@Component({
  selector: 'app-loja',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Catálogo de Produtos & Serviços</h2>
        <a routerLink="/carrinho" class="btn btn-primary position-relative">
          Carrinho
          <span *ngIf="carrinhoService.totalItens() > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {{ carrinhoService.totalItens() }}
          </span>
        </a>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-md-5">
          <input type="text" class="form-control" placeholder="Buscar por nome..." [(ngModel)]="termoBusca" (ngModelChange)="filtrar()">
        </div>
        <div class="col-md-4">
          <select class="form-select" [(ngModel)]="categoriaSelecionada" (change)="filtrar()">
            <option [value]="0">Todas as Categorias</option>
            <option *ngFor="let cat of categorias()" [value]="cat.idcategoria">{{ cat.categoria }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" [(ngModel)]="tipoItemSelecionado" (change)="filtrar()">
            <option value="TODOS">Todos os Tipos</option>
            <option value="P">Apenas Produtos</option>
            <option value="S">Apenas Serviços</option>
          </select>
        </div>
      </div>

      <div *ngIf="carregando()" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Carregando catálogo...</p>
      </div>

      <div *ngIf="erro()" class="alert alert-danger">{{ erro() }}</div>

      <div *ngIf="!carregando() && !erro()" class="row row-cols-1 row-cols-md-3 g-4">
        <div class="col" *ngFor="let p of produtosFiltrados()">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <span class="badge mb-2 w-auto me-auto" [ngClass]="p.iditemNavigation?.tipoItem === 'P' ? 'bg-info' : 'bg-success'">
                {{ p.iditemNavigation?.tipoItem === 'P' ? 'Produto' : 'Serviço' }}
              </span>
              <h5 class="card-title">{{ p.iditemNavigation?.item1 }}</h5>
              <p class="card-text text-muted flex-grow-1">{{ p.iditemNavigation?.descricaoItem }}</p>
              <div class="mt-auto">
                <h4 class="text-primary fw-bold">R$ {{ p.precoVenda | number:'1.2-2' }}</h4>
                <button class="btn btn-outline-primary w-100 mt-2" (click)="adicionarAoCarrinho(p)">
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LojaComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);
  public carrinhoService = inject(CarrinhoService);

  todosProdutos = signal<ProdutoBackendResponse[]>([]);
  produtosFiltrados = signal<ProdutoBackendResponse[]>([]);
  categorias = signal<Categorium[]>([]);
  carregando = signal<boolean>(true);
  erro = signal<string | null>(null);

  termoBusca = '';
  categoriaSelecionada = 0;
  tipoItemSelecionado = 'TODOS';

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando.set(true);
    this.produtoService.getProdutos().subscribe({
      next: (res) => {
        this.todosProdutos.set(res);
        this.filtrar();
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Falha de comunicação com o backend ao carregar produtos.');
        this.carregando.set(false);
      }
    });

    this.categoriaService.getCategorias().subscribe({
      next: (res) => this.categorias.set(res),
      error: () => {}
    });
  }

  filtrar(): void {
    let lista = this.todosProdutos();
    if (this.termoBusca.trim() !== '') {
      const termo = this.termoBusca.toLowerCase();
      lista = lista.filter(p => p.iditemNavigation?.item1.toLowerCase().includes(termo) ||
                                 p.iditemNavigation?.descricaoItem.toLowerCase().includes(termo));
    }
    if (this.categoriaSelecionada > 0) {
      lista = lista.filter(p => p.iditemNavigation?.idcategoria === Number(this.categoriaSelecionada));
    }
    if (this.tipoItemSelecionado !== 'TODOS') {
      lista = lista.filter(p => p.iditemNavigation?.tipoItem === this.tipoItemSelecionado);
    }
    this.produtosFiltrados.set(lista);
  }

  adicionarAoCarrinho(p: ProdutoBackendResponse): void {
    if (!p.iditemNavigation) return;
    this.carrinhoService.adicionarItem({
      idItem: p.iditem,
      descricao: p.iditemNavigation.item1,
      precoUnitario: p.precoVenda,
      quantidade: 1,
      tipoItem: p.iditemNavigation.tipoItem
    });
  }
}
