import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService } from '../../../services/pessoa.service';
import { PessoaDTO } from '../../../models/pessoa.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestão de Clientes</h2>
        <button class="btn btn-primary" (click)="novoCliente()">Novo Cliente</button>
      </div>

      <div *ngIf="exibirFormulario()" class="card shadow-sm mb-4 p-3">
        <h4>{{ editandoId() ? 'Editar Cliente' : 'Cadastrar Cliente' }}</h4>
        <form (ngSubmit)="salvar()">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nome Completo</label>
              <input type="text" class="form-control" [(ngModel)]="clienteForm.nome" name="nome" required>
            </div>
            <div class="col-md-3">
              <label class="form-label">CPF (11 dígitos)</label>
              <input 
                type="text" 
                class="form-control" 
                [(ngModel)]="clienteForm.cpf" 
                name="cpf" 
                maxlength="11"
                oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                placeholder="Apenas números"
                required>
            </div>
            <div class="col-md-3">
              <label class="form-label">E-mail</label>
              <input type="email" class="form-control" [(ngModel)]="clienteForm.email" name="email" required>
            </div>
          </div>
          <div class="mt-3">
            <button type="submit" class="btn btn-success me-2">Salvar</button>
            <button type="button" class="btn btn-secondary" (click)="exibirFormulario.set(false)">Cancelar</button>
          </div>
        </form>
      </div>

      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of clientes()">
            <td>{{ c.idPessoa }}</td>
            <td>{{ c.nome }}</td>
            <td>{{ c.cpf }}</td>
            <td>{{ c.email }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" (click)="editar(c)">Editar</button>
              <button class="btn btn-sm btn-outline-danger" (click)="excluir(c.idPessoa!)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ClientesComponent implements OnInit {
  private pessoaService = inject(PessoaService);

  clientes = signal<PessoaDTO[]>([]);
  exibirFormulario = signal<boolean>(false);
  editandoId = signal<number | null>(null);

  clienteForm: any = {
    nome: '', 
    cpf: '', 
    dataNascimento: '2000-01-01', 
    sexo: 'M', 
    email: '', 
    telefone: '00000000000', 
    ativoPessoa: 'S'
  };

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.pessoaService.getAll().subscribe({ next: (res) => this.clientes.set(res) });
  }

  novoCliente(): void {
    this.clienteForm = {
      nome: '', 
      cpf: '', 
      dataNascimento: '2000-01-01', 
      sexo: 'M', 
      email: '', 
      telefone: '00000000000', 
      ativoPessoa: 'S'
    };
    this.editandoId.set(null);
    this.exibirFormulario.set(true);
  }

  editar(c: any): void {
    this.clienteForm = JSON.parse(JSON.stringify(c));
    this.editandoId.set(c.idPessoa || null);
    this.exibirFormulario.set(true);
  }

  salvar(): void {
    if (this.editandoId()) {
      this.pessoaService.update(this.editandoId()!, this.clienteForm).subscribe({
        next: () => { this.exibirFormulario.set(false); this.carregar(); },
        error: (err) => console.error('Erro ao atualizar:', err)
      });
    } else {
      this.pessoaService.create(this.clienteForm).subscribe({
        next: () => { this.exibirFormulario.set(false); this.carregar(); },
        error: (err) => console.error('Erro ao criar:', err)
      });
    }
  }

  excluir(id: number): void {
    if (confirm('Deseja excluir?')) {
      this.pessoaService.delete(id).subscribe(() => this.carregar());
    }
  }
}