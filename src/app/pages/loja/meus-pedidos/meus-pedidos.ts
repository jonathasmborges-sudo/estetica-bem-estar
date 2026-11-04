import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtendimentoService } from '../../../services/atendimento.service';
import { PessoaService } from '../../../services/pessoa.service';
import { AtendimentoDTO } from '../../../models/atendimento.model';

interface ClienteItem {
  idpessoa: number;
  nomePessoa: string;
  cpfPessoa?: string;
}

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container my-4">
      <h2 class="mb-4">Consultar Meus Pedidos</h2>

      <div class="card p-4 shadow-sm mb-4 bg-light">
        <div class="row align-items-end g-3">
          <div class="col-md-8">
            <label class="form-label fw-bold">Selecione o Cliente para Visualizar o Histórico:</label>
            <select class="form-select" [(ngModel)]="idClienteSelecionado" (change)="buscarPedidos()">
              <option [value]="0">-- Selecione um Cliente --</option>
              <option *ngFor="let c of clientes()" [value]="c.idpessoa">
                {{ c.nomePessoa }} {{ c.cpfPessoa ? '(CPF: ' + c.cpfPessoa + ')' : '' }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <button class="btn btn-primary w-100" (click)="buscarPedidos()">Filtrar Pedidos</button>
          </div>
        </div>
      </div>

      <div *ngIf="pedidosCliente().length > 0; else semPedidos" class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-dark">
            <tr>
              <th># Pedido</th>
              <th>Data</th>
              <th>Status</th>
              <th>Quantidade de Itens</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of pedidosCliente()">
              <td>#{{ p.idAtendimento }}</td>
              <td>{{ p.dataAtendimento }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-warning text-dark': p.statusAtendimento === 'Aberto',
                  'bg-info text-dark': p.statusAtendimento === 'Em processamento',
                  'bg-success': p.statusAtendimento === 'Concluído',
                  'bg-danger': p.statusAtendimento === 'Cancelado'
                }">{{ p.statusAtendimento }}</span>
              </td>
              <td>{{ p.itens.length }} item(ns)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #semPedidos>
        <div class="alert alert-info text-center" *ngIf="idClienteSelecionado > 0">
          Nenhum pedido localizado para este cliente.
        </div>
      </ng-template>
    </div>
  `
})
export class MeusPedidosComponent implements OnInit {
  private atendimentoService = inject(AtendimentoService);
  private pessoaService = inject(PessoaService);

  clientes = signal<ClienteItem[]>([]);
  todosPedidos = signal<AtendimentoDTO[]>([]);
  pedidosCliente = signal<AtendimentoDTO[]>([]);
  idClienteSelecionado = 0;

  ngOnInit(): void {
    this.pessoaService.getAll().subscribe({ next: (res: any) => this.clientes.set(res) });
    this.atendimentoService.getAtendimentos().subscribe({ next: (res) => this.todosPedidos.set(res) });
  }

  buscarPedidos(): void {
    if (this.idClienteSelecionado <= 0) {
      this.pedidosCliente.set([]);
      return;
    }
    const filtrados = this.todosPedidos().filter(p => p.idPessoa === Number(this.idClienteSelecionado));
    this.pedidosCliente.set(filtrados);
  }
}

export { MeusPedidosComponent as MeusPedidos };