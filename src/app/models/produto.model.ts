export interface ProdutoDTO {
  idCategoria: number;
  item: string;
  descricaoItem: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico: string;
  codigoPreco: number;
  precoVenda: number;
  unidade: string;
}

export interface ProdutoBackendResponse {
  iditem: number;
  codigoPreco: number;
  precoVenda: number;
  unidade: string;
  iditemNavigation?: {
    iditem: number;
    idcategoria: number;
    item1: string;
    descricaoItem: string;
    preco: number;
    tipoItem: string;
    ativoProdutoServico: string;
  };
}
