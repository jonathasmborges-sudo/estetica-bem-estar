export interface EnderecoDTO {
  idEndereco?: number;
  idPessoa?: number;
  cep: string;
  numero: string;
  complemento: string;
}

export interface PessoaDTO {
  idPessoa?: number;
  nome: string;
  cpf: number;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: number;
  ativoPessoa: string;
  enderecos: EnderecoDTO[];
}
