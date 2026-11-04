import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EstoqueDTO {
  iditem: number;
  quantidadeEstoque: number;
  iditemNavigation?: {
    item1: string;
    descricaoItem: string;
    tipoItem: string;
    idcategoria: number;
    ativoItem: string;
  };
  precoVenda?: number;
  unidade?: string;
}

export interface EntradaProdutoDTO {
  identradaProduto?: number;
  iditem: number;
  dataEntradaProduto: string;
  quantidadeEntrada: number;
  unidade: string;
  valorUnitarioEntrada: number;
}

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private http = inject(HttpClient);
  private apiUrlEstoque = `${environment.apiUrl}/Estoque`;
  private apiUrlEntrada = `${environment.apiUrl}/EntradaProduto`;

  getEstoque(): Observable<EstoqueDTO[]> {
    return this.http.get<EstoqueDTO[]>(this.apiUrlEstoque);
  }

  getEstoquePorId(idItem: number): Observable<EstoqueDTO> {
    return this.http.get<EstoqueDTO>(`${this.apiUrlEstoque}/${idItem}`);
  }

  registrarEntrada(dto: EntradaProdutoDTO): Observable<EntradaProdutoDTO> {
    return this.http.post<EntradaProdutoDTO>(this.apiUrlEntrada, dto);
  }
}