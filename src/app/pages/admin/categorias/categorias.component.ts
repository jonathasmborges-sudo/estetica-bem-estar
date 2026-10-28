import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../services/categoria.service';
import { Categorium } from '../../../models/categoria.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container my-4">
      <h2>Gestão de Categorias</h2>
      <ul class="list-group mt-3">
        <li *ngFor="let c of categorias()" class="list-group-item d-flex justify-content-between align-items-center">
          <span>#{{ c.idcategoria }} - {{ c.categoria }}</span>
        </li>
      </ul>
    </div>
  `
})
export class CategoriasComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  categorias = signal<Categorium[]>([]);

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe({ next: (res) => this.categorias.set(res) });
  }
}
