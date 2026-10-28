import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProdutoDTO, ProdutoBackendResponse } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ProdutoItem`;

  getProdutos(): Observable<ProdutoBackendResponse[]> {
    return this.http.get<ProdutoBackendResponse[]>(this.apiUrl);
  }

  getProduto(id: number): Observable<ProdutoBackendResponse> {
    return this.http.get<ProdutoBackendResponse>(`${this.apiUrl}/${id}`);
  }

  createProduto(dto: ProdutoDTO): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  updateProduto(id: number, dto: ProdutoDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
