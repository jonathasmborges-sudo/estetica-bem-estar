import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';
import { PessoaService } from '../../services/pessoa.service';
import { AtendimentoService } from '../../services/atendimento.service';
import { PessoaDTO } from '../../models/pessoa.model';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container my-4">
      <h2>Carrinho de Compras</h2>

      <div *ngIf="carrinhoService.itens().length === 0" class="alert alert-info mt-4">
        Seu carrinho está vazio. <a routerLink="/loja">Voltar para a loja</a>
      </div>

      <div *ngIf="carrinhoService.itens().length > 0" class="row mt-4">
        <div class="col-md-8">
          <table class="table table-hover align-middle">
            <thead>
              <tr>
                <th>Item</th>
                <th>Preço Un.</th>
                <th>Qtd</th>
                <th>Subtotal</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of carrinhoService.itens()">
                <td>{{ item.descricao }}</td>
                <td>R$ {{ item.precoUnitario | number:'1.2-2' }}</td>
                <td style="width: 120px;">
                  <input type="number" class="form-control" [value]="item.quantidade" min="1" (change)="alterarQtd(item.idItem, $event)">
                </td>
                <td>R$ {{ (item.precoUnitario * item.quantidade) | number:'1.2-2' }}</td>
                <td>
                  <button class="btn btn-sm btn-danger" (click)="remover(item.idItem)">Remover</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-md-4">
          <div class="card shadow-sm p-3 mb-3">
            <h4>Resumo do Pedido</h4>
            <hr>
            <div class="d-flex justify-content-between mb-3">
              <span>Valor Total:</span>
              <strong class="text-primary h4">R$ {{ carrinhoService.valorTotal() | number:'1.2-2' }}</strong>
            </div>

            <div class="mb-3">
              <label class="form-label">Cliente (*):</label>
              <select class="form-select" [(ngModel)]="idPessoaSelecionada">
                <option [value]="0">-- Selecione um cliente --</option>
                <option *ngFor="let c of clientes()" [value]="c.idPessoa">{{ c.nome }} (CPF: {{ c.cpf }})</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">ID Funcionário (*):</label>
              <input type="number" class="form-control" [(ngModel)]="idFuncionario">
            </div>

            <button class="btn btn-success w-100 mt-2" [disabled]="processando()" (click)="confirmarCompra()">
              {{ processando() ? 'Processando...' : 'Confirmar Pedido' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CarrinhoComponent implements OnInit {
  public carrinhoService = inject(CarrinhoService);
  private pessoaService = inject(PessoaService);
  private atendimentoService = inject(AtendimentoService);

  clientes = signal<PessoaDTO[]>([]);
  idPessoaSelecionada = 0;
  idFuncionario = 1;
  processando = signal<boolean>(false);

  ngOnInit(): void {
    this.pessoaService.getAll().subscribe({
      next: (res) => this.clientes.set(res.filter(p => p.ativoPessoa === 'S'))
    });
  }

  alterarQtd(idItem: number, event: any): void {
    this.carrinhoService.alterarQuantidade(idItem, Number(event.target.value));
  }

  remover(idItem: number): void {
    this.carrinhoService.removerItem(idItem);
  }

  confirmarCompra(): void {
    if (this.idPessoaSelecionada <= 0) return alert('Selecione um cliente!');
    this.processando.set(true);

    const hoje = new Date().toISOString().split('T')[0];
    const pedido = {
      idPessoa: Number(this.idPessoaSelecionada),
      dataAtendimento: hoje,
      statusAtendimento: 'Aberto',
      itens: this.carrinhoService.itens().map(i => ({
        idItem: i.idItem,
        idFuncionario: Number(this.idFuncionario),
        quantidade: i.quantidade,
        valorUnitario: i.precoUnitario
      }))
    };

    this.atendimentoService.createAtendimento(pedido).subscribe({
      next: (res) => {
        alert(`Pedido #${res.idAtendimento} realizado com sucesso!`);
        this.carrinhoService.limpar();
        this.processando.set(false);
      },
      error: () => {
        alert('Erro ao registrar pedido.');
        this.processando.set(false);
      }
    });
  }
}
