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
  private readonly key = 'carrinho_loja';

  private itensSignal = signal<ItemCarrinho[]>(this.carregarInicial());

  itens = computed(() => this.itensSignal());
  totalItens = computed(() => this.itensSignal().reduce((acc, item) => acc + item.quantidade, 0));
  valorTotal = computed(() => this.itensSignal().reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0));

  private carregarInicial(): ItemCarrinho[] {
    const dados = localStorage.getItem(this.key);
    return dados ? JSON.parse(dados) : [];
  }

  private salvar(novosItens: ItemCarrinho[]): void {
    this.itensSignal.set(novosItens);
    localStorage.setItem(this.key, JSON.stringify(novosItens));
  }

  adicionarItem(item: ItemCarrinho): void {
    const atuais = this.itensSignal();
    const index = atuais.findIndex(i => i.idItem === item.idItem);
    if (index > -1) {
      const novos = [...atuais];
      novos[index] = {
        ...novos[index],
        quantidade: novos[index].quantidade + item.quantidade
      };
      this.salvar(novos);
    } else {
      this.salvar([...atuais, item]);
    }
  }

  alterarQuantidade(idItem: number, quantidade: number): void {
    if (quantidade <= 0) {
      this.removerItem(idItem);
      return;
    }
    const novos = this.itensSignal().map(i => i.idItem === idItem ? { ...i, quantidade } : i);
    this.salvar(novos);
  }

  removerItem(idItem: number): void {
    this.salvar(this.itensSignal().filter(i => i.idItem !== idItem));
  }

  limpar(): void {
    localStorage.removeItem(this.key);
    this.itensSignal.set([]);
  }
}