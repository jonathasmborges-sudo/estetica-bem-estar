import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PessoaService } from '../../../services/pessoa.service';
import { ProdutoService } from '../../../services/produto.service';
import { AtendimentoService } from '../../../services/atendimento.service';
import { EstoqueService } from '../../../services/estoque';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container my-4">
      <h2 class="mb-4">Painel de Controle Administrativo (Dashboard)</h2>

      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white shadow-sm p-3">
            <h5>Total Clientes</h5>
            <h2 class="fw-bold">{{ totalClientes() }}</h2>
            <a routerLink="/admin/clientes" class="text-white text-decoration-underline fs-6">Gerenciar Clientes &rarr;</a>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card bg-success text-white shadow-sm p-3">
            <h5>Produtos & Serviços</h5>
            <h2 class="fw-bold">{{ totalProdutos() }}</h2>
            <a routerLink="/admin/produtos" class="text-white text-decoration-underline fs-6">Ver Catálogo &rarr;</a>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card bg-warning text-dark shadow-sm p-3">
            <h5>Pedidos Registrados</h5>
            <h2 class="fw-bold">{{ totalPedidos() }}</h2>
            <a routerLink="/admin/atendimentos" class="text-dark text-decoration-underline fs-6">Ver Atendimentos &rarr;</a>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card bg-info text-white shadow-sm p-3">
            <h5>Itens em Estoque</h5>
            <h2 class="fw-bold">{{ totalEstoque() }}</h2>
            <a routerLink="/admin/estoque" class="text-white text-decoration-underline fs-6">Gerenciar Estoque &rarr;</a>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-md-6">
          <div class="card shadow-sm p-4">
            <h4>Ações Rápidas - Módulo 2</h4>
            <p class="text-muted">Acesse as principais telas do Painel Administrativo:</p>
            <div class="d-grid gap-2">
              <a routerLink="/admin/atendimentos" class="btn btn-outline-primary text-start">📦 Gestão de Pedidos & Atendimentos</a>
              <a routerLink="/admin/estoque" class="btn btn-outline-success text-start">📥 Entrada de Estoque & Mercadorias</a>
              <a routerLink="/admin/clientes" class="btn btn-outline-dark text-start">👤 Cadastro Geral de Clientes</a>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card shadow-sm p-4">
            <h4>Visão da Loja Virtual</h4>
            <p class="text-muted">Navegue até a interface do cliente para testar novos pedidos:</p>
            <div class="d-grid gap-2">
              <a routerLink="/loja" class="btn btn-primary text-start">🛒 Abrir Catálogo da Loja Virtual</a>
              <a routerLink="/carrinho" class="btn btn-outline-secondary text-start">🛍️ Visualizar Carrinho Atual</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private pessoaService = inject(PessoaService);
  private produtoService = inject(ProdutoService);
  private atendimentoService = inject(AtendimentoService);
  private estoqueService = inject(EstoqueService);

  totalClientes = signal<number>(0);
  totalProdutos = signal<number>(0);
  totalPedidos = signal<number>(0);
  totalEstoque = signal<number>(0);

  ngOnInit(): void {
    this.carregarResumos();
  }

  carregarResumos(): void {
    this.pessoaService.getAll().subscribe({
      next: (res) => this.totalClientes.set(res.length),
      error: () => {}
    });

    this.produtoService.getProdutos().subscribe({
      next: (res) => this.totalProdutos.set(res.length),
      error: () => {}
    });

    this.atendimentoService.getAtendimentos().subscribe({
      next: (res) => this.totalPedidos.set(res.length),
      error: () => {}
    });

    this.estoqueService.getEstoque().subscribe({
      next: (res) => {
        const total = res.reduce((acc, i) => acc + (i.quantidadeEstoque || 0), 0);
        this.totalEstoque.set(total);
      },
      error: () => {}
    });
  }
}

export { DashboardComponent as Dashboard };