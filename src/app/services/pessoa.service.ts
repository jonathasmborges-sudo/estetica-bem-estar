import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PessoaDTO } from '../models/pessoa.model';

@Injectable({ providedIn: 'root' })
export class PessoaService {
  private http = inject(HttpClient);
  // Endpoint corrigido de /PessoaEndereco para /Pessoa
  private apiUrl = `${environment.apiUrl}/Pessoa`;

  getAll(): Observable<PessoaDTO[]> {
    return this.http.get<PessoaDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<PessoaDTO> {
    return this.http.get<PessoaDTO>(`${this.apiUrl}/${id}`);
  }

  create(dto: PessoaDTO): Observable<PessoaDTO> {
    return this.http.post<PessoaDTO>(this.apiUrl, dto);
  }

  update(id: number, dto: PessoaDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}