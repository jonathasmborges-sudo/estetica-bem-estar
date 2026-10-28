import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtendimentoService } from '../../../services/atendimento.service';
import { AtendimentoDTO } from '../../../models/atendimento.model';

@Component({
  selector: 'app-atendimentos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container my-4">
      <h2>Gestão de Pedidos e Atendimentos</h2>
      <table class="table table-hover mt-3">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Status</th>
            <th>Itens</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of atendimentos()">
            <td>#{{ a.idAtendimento }}</td>
            <td>{{ a.nomePessoa }}</td>
            <td>{{ a.dataAtendimento }}</td>
            <td><span class="badge bg-primary">{{ a.statusAtendimento }}</span></td>
            <td>{{ a.itens.length }} item(ns)</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AtendimentosComponent implements OnInit {
  private atendimentoService = inject(AtendimentoService);
  atendimentos = signal<AtendimentoDTO[]>([]);

  ngOnInit(): void {
    this.atendimentoService.getAtendimentos().subscribe({ next: (res) => this.atendimentos.set(res) });
  }
}
