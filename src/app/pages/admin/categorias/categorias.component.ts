import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria.service';
import { Categorium } from '../../../models/categoria.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestão de Categorias</h2>
        <button class="btn btn-primary" (click)="novaCategoria()">+ Nova Categoria</button>
      </div>

      <div *ngIf="exibirFormulario()" class="card shadow-sm mb-4 p-3 bg-light">
        <h4>{{ editandoId() ? 'Editar Categoria' : 'Cadastrar Categoria' }}</h4>
        <form (ngSubmit)="salvar()">
          <div class="row g-3">
            <div class="col-md-8">
              <label class="form-label">Nome da Categoria (*)</label>
              <input type="text" class="form-control" [(ngModel)]="nomeCategoria" name="categoria" required>
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
            <th>Nome da Categoria</th>
            <th style="width: 200px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of categorias()">
            <td>#{{ c.idcategoria }}</td>
            <td><strong>{{ c.categoria }}</strong></td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" (click)="editar(c)">Editar</button>
              <button class="btn btn-sm btn-outline-danger" (click)="excluir(c.idcategoria)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class CategoriasComponent implements OnInit {
  private categoriaService = inject(CategoriaService);

  categorias = signal<Categorium[]>([]);
  exibirFormulario = signal<boolean>(false);
  editandoId = signal<number | null>(null);
  nomeCategoria = '';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.categoriaService.getCategorias().subscribe({ next: (res) => this.categorias.set(res) });
  }

  novaCategoria(): void {
    this.nomeCategoria = '';
    this.editandoId.set(null);
    this.exibirFormulario.set(true);
  }

  editar(c: Categorium): void {
    this.nomeCategoria = c.categoria;
    this.editandoId.set(c.idcategoria);
    this.exibirFormulario.set(true);
  }

  salvar(): void {
    const payload: Categorium = { idcategoria: this.editandoId() || 0, categoria: this.nomeCategoria };
    if (this.editandoId()) {
      this.categoriaService.updateCategoria(this.editandoId()!, payload).subscribe({
        next: () => { this.exibirFormulario.set(false); this.carregar(); }
      });
    } else {
      this.categoriaService.createCategoria(payload).subscribe({
        next: () => { this.exibirFormulario.set(false); this.carregar(); }
      });
    }
  }

  excluir(id: number): void {
    if (confirm('Deseja excluir esta categoria?')) {
      this.categoriaService.deleteCategoria(id).subscribe({
        next: () => this.carregar(),
        error: () => alert('Não é possível excluir categorias com produtos vinculados.')
      });
    }
  }
}