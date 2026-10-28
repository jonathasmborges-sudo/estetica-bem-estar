import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../../services/produto.service';
import { ProdutoBackendResponse } from '../../../models/produto.model';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container my-4">
      <h2>Gestão de Produtos e Serviços</h2>
      <table class="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Tipo</th>
            <th>Preço Venda</th>
            <th>Unidade</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of produtos()">
            <td>{{ p.iditem }}</td>
            <td>{{ p.iditemNavigation?.item1 }}</td>
            <td>
              <span class="badge" [ngClass]="p.iditemNavigation?.tipoItem === 'P' ? 'bg-info' : 'bg-success'">
                {{ p.iditemNavigation?.tipoItem === 'P' ? 'Produto' : 'Serviço' }}
              </span>
            </td>
            <td>R$ {{ p.precoVenda | number:'1.2-2' }}</td>
            <td>{{ p.unidade }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ProdutosComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  produtos = signal<ProdutoBackendResponse[]>([]);

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe({ next: (res) => this.produtos.set(res) });
  }
}
