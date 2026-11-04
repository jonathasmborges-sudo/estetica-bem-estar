import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtendimentoService } from '../../../services/atendimento.service';
import { AtendimentoDTO } from '../../../models/atendimento.model';

@Component({
  selector: 'app-atendimentos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestão de Pedidos e Atendimentos</h2>
        <div class="d-flex align-items-center gap-2">
          <label class="fw-bold mb-0">Status:</label>
          <select class="form-select w-auto" [(ngModel)]="statusFiltro" (change)="filtrar()">
            <option value="TODOS">Todos os Status</option>
            <option value="Aberto">Aberto</option>
            <option value="Em processamento">Em processamento</option>
            <option value="Concluído">Concluído</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mt-3">
          <thead class="table-dark">
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Status Atual</th>
              <th>Alterar Status</th>
              <th>Itens</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of atendimentosFiltrados()">
              <td>#{{ a.idAtendimento }}</td>
              <td>{{ a.nomePessoa }}</td>
              <td>{{ a.dataAtendimento }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-warning text-dark': a.statusAtendimento === 'Aberto',
                  'bg-info text-dark': a.statusAtendimento === 'Em processamento',
                  'bg-success': a.statusAtendimento === 'Concluído',
                  'bg-danger': a.statusAtendimento === 'Cancelado'
                }">{{ a.statusAtendimento }}</span>
              </td>
              <td>
                <select class="form-select form-select-sm" [ngModel]="a.statusAtendimento" (change)="alterarStatus(a, $event)">
                  <option value="Aberto">Aberto</option>
                  <option value="Em processamento">Em processamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </td>
              <td>{{ a.itens.length }} item(ns)</td>
            </tr>
            <tr *ngIf="atendimentosFiltrados().length === 0">
              <td colspan="6" class="text-center py-3 text-muted">Nenhum pedido encontrado.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AtendimentosComponent implements OnInit {
  private atendimentoService = inject(AtendimentoService);

  todosAtendimentos = signal<AtendimentoDTO[]>([]);
  atendimentosFiltrados = signal<AtendimentoDTO[]>([]);
  statusFiltro = 'TODOS';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.atendimentoService.getAtendimentos().subscribe({
      next: (res) => {
        this.todosAtendimentos.set(res);
        this.filtrar();
      },
      error: (err) => console.error('Erro ao carregar atendimentos:', err)
    });
  }

  filtrar(): void {
    if (this.statusFiltro === 'TODOS') {
      this.atendimentosFiltrados.set(this.todosAtendimentos());
    } else {
      this.atendimentosFiltrados.set(
        this.todosAtendimentos().filter(a => a.statusAtendimento === this.statusFiltro)
      );
    }
  }

  alterarStatus(atendimento: AtendimentoDTO, event: any): void {
    const novoStatus = event.target.value;
    const payload = { ...atendimento, statusAtendimento: novoStatus };

    this.atendimentoService.updateAtendimento(atendimento.idAtendimento!, payload as any).subscribe({
      next: () => {
        atendimento.statusAtendimento = novoStatus;
        this.filtrar();
      },
      error: (err) => console.error('Erro ao atualizar status:', err)
    });
  }
}