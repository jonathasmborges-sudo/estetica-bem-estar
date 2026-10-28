import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AtendimentoDTO, AtendimentoAddPutDTO } from '../models/atendimento.model';

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Atendimento`;

  getAtendimentos(): Observable<AtendimentoDTO[]> {
    return this.http.get<AtendimentoDTO[]>(this.apiUrl);
  }

  getAtendimento(id: number): Observable<AtendimentoDTO> {
    return this.http.get<AtendimentoDTO>(`${this.apiUrl}/${id}`);
  }

  createAtendimento(dto: AtendimentoAddPutDTO): Observable<AtendimentoAddPutDTO> {
    return this.http.post<AtendimentoAddPutDTO>(this.apiUrl, dto);
  }

  updateAtendimento(id: number, dto: AtendimentoAddPutDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  deleteAtendimento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
