export interface AtendimentoItemAddPutDTO {
  idAtendimento?: number;
  idItem: number;
  idFuncionario: number;
  quantidade: number;
  valorUnitario: number;
}

export interface AtendimentoAddPutDTO {
  idAtendimento?: number;
  idPessoa: number;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: AtendimentoItemAddPutDTO[];
}

export interface AtendimentoItemDTO {
  idAtendimento: number;
  idItem: number;
  item: string;
  idFuncionario: number;
  nomeFuncionario: string;
  cargo: string;
  quantidade: number;
  valorUnitario: number;
}

export interface AtendimentoDTO {
  idAtendimento: number;
  idPessoa: number;
  nomePessoa: string;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: AtendimentoItemDTO[];
}
