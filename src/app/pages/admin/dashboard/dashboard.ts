import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../../../services/produto.service';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container my-4">
      <h2 class="mb-4">Painel Administrativo</h2>

      <div class="row g-4 mb-4">
        <!-- Card Produtos -->
        <div class="col-md-3">
          <div class="card text-white bg-primary shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title">Produtos</h5>
              <h2 class="display-5 fw-bold">{{ totalProdutos() }}</h2>
              <p class="card-text">Itens cadastrados do tipo Produto</p>
            </div>
            <div class="card-footer bg-transparent border-top-0">
              <a routerLink="/admin/produtos" class="text-white text-decoration-none">Gerenciar Produtos &rarr;</a>
            </div>
          </div>
        </div>

        <!-- Card Serviços -->
        <div class="col-md-3">
          <div class="card text-white bg-success shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title">Serviços</h5>
              <h2 class="display-5 fw-bold">{{ totalServicos() }}</h2>
              <p class="card-text">Itens cadastrados do tipo Serviço</p>
            </div>
            <div class="card-footer bg-transparent border-top-0">
              <a routerLink="/admin/produtos" class="text-white text-decoration-none">Gerenciar Serviços &rarr;</a>
            </div>
          </div>
        </div>

        <!-- Card Categorias -->
        <div class="col-md-3">
          <div class="card text-white bg-warning shadow-sm h-100">
            <div class="card-body text-dark">
              <h5 class="card-title">Categorias</h5>
              <h2 class="display-5 fw-bold">{{ totalCategorias() }}</h2>
              <p class="card-text">Categorias ativas registradas</p>
            </div>
            <div class="card-footer bg-transparent border-top-0">
              <a routerLink="/admin/categorias" class="text-dark fw-bold text-decoration-none">Gerenciar Categorias &rarr;</a>
            </div>
          </div>
        </div>

        <!-- Card Total de Itens -->
        <div class="col-md-3">
          <div class="card text-white bg-info shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title">Total no Catálogo</h5>
              <h2 class="display-5 fw-bold">{{ totalGeral() }}</h2>
              <p class="card-text">Produtos e Serviços no sistema</p>
            </div>
            <div class="card-footer bg-transparent border-top-0">
              <a routerLink="/loja" class="text-white text-decoration-none">Ver Loja Virtual &rarr;</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção Resumo Geral -->
      <div class="card shadow-sm p-4">
        <h4>Status dos Módulos da Aplicação</h4>
        <div class="table-responsive mt-3">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Módulo</th>
                <th>Status da Integração</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Categorias</strong></td>
                <td><span class="badge bg-success">Operacional</span></td>
                <td><a routerLink="/admin/categorias" class="btn btn-sm btn-outline-secondary">Acessar</a></td>
              </tr>
              <tr>
                <td><strong>Produtos & Serviços</strong></td>
                <td><span class="badge bg-success">Operacional</span></td>
                <td><a routerLink="/admin/produtos" class="btn btn-sm btn-outline-secondary">Acessar</a></td>
              </tr>
              <tr>
                <td><strong>Loja Virtual</strong></td>
                <td><span class="badge bg-success">Operacional</span></td>
                <td><a routerLink="/loja" class="btn btn-sm btn-outline-secondary">Acessar</a></td>
              </tr>
              <tr>
                <td><strong>Carrinho & Checkout</strong></td>
                <td><span class="badge bg-warning text-dark">Em validação</span></td>
                <td><a routerLink="/carrinho" class="btn btn-sm btn-outline-secondary">Acessar</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class Dashboard implements OnInit {
  private produtoService = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);

  totalProdutos = signal<number>(0);
  totalServicos = signal<number>(0);
  totalCategorias = signal<number>(0);
  totalGeral = signal<number>(0);

  ngOnInit(): void {
    this.carregarMetricas();
  }

  carregarMetricas(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (res) => this.totalCategorias.set(res?.length || 0),
      error: () => this.totalCategorias.set(0)
    });

    this.produtoService.getProdutos().subscribe({
      next: (res) => {
        if (res && Array.isArray(res)) {
          this.totalGeral.set(res.length);
          const prods = res.filter(p => p.iditemNavigation?.tipoItem === 'P').length;
          const servs = res.filter(p => p.iditemNavigation?.tipoItem === 'S').length;
          this.totalProdutos.set(prods);
          this.totalServicos.set(servs);
        }
      },
      error: () => {
        this.totalProdutos.set(0);
        this.totalServicos.set(0);
        this.totalGeral.set(0);
      }
    });
  }
}