import { Injectable, signal, computed } from '@angular/core';

export interface ItemCarrinho {
  idItem: number;
  descricao: string;
  precoUnitario: number;
  quantidade: number;
  tipoItem: string;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private itensSignal = signal<ItemCarrinho[]>([]);

  itens = computed(() => this.itensSignal());
  totalItens = computed(() => this.itensSignal().reduce((acc, item) => acc + item.quantidade, 0));
  valorTotal = computed(() => this.itensSignal().reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0));

  adicionarItem(item: ItemCarrinho): void {
    const atuais = this.itensSignal();
    const index = atuais.findIndex(i => i.idItem === item.idItem);
    if (index > -1) {
      const novos = [...atuais];
      novos[index].quantidade += item.quantidade;
      this.itensSignal.set(novos);
    } else {
      this.itensSignal.set([...atuais, item]);
    }
  }

  alterarQuantidade(idItem: number, quantidade: number): void {
    if (quantidade <= 0) {
      this.removerItem(idItem);
      return;
    }
    const novos = this.itensSignal().map(i => i.idItem === idItem ? { ...i, quantidade } : i);
    this.itensSignal.set(novos);
  }

  removerItem(idItem: number): void {
    this.itensSignal.set(this.itensSignal().filter(i => i.idItem !== idItem));
  }

  limpar(): void {
    this.itensSignal.set([]);
  }
}
