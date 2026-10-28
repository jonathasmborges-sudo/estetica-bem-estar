import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categorium } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Categorium`;

  getCategorias(): Observable<Categorium[]> {
    return this.http.get<Categorium[]>(this.apiUrl);
  }

  getCategoria(id: number): Observable<Categorium> {
    return this.http.get<Categorium>(`${this.apiUrl}/${id}`);
  }

  createCategoria(categoria: Categorium): Observable<Categorium> {
    return this.http.post<Categorium>(this.apiUrl, categoria);
  }

  updateCategoria(id: number, categoria: Categorium): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, categoria);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
