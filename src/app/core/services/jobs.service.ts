import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import {
  JobFilter,
  PageResponse,
  Vaga
} from '../models/job.models';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/jobs`;

  buscar(
    filtro: JobFilter
  ): Observable<ApiResponse<PageResponse<Vaga>>> {

    let params = new HttpParams();

    if (filtro.titulo?.trim()) {
      params = params.set(
        'titulo',
        filtro.titulo.trim()
      );
    }

    if (filtro.cidade?.trim()) {
      params = params.set(
        'cidade',
        filtro.cidade.trim()
      );
    }

    if (filtro.estado?.trim()) {
      params = params.set(
        'estado',
        filtro.estado.trim().toUpperCase()
      );
    }

    if (filtro.status) {
      params = params.set(
        'status',
        filtro.status
      );
    }

    params = params
      .set('page', filtro.page ?? 0)
      .set('size', filtro.size ?? 9)
      .set(
        'sort',
        filtro.sort ?? 'createdAt,desc'
      );

    return this.http.get<
      ApiResponse<PageResponse<Vaga>>
    >(
      this.apiUrl,
      { params }
    );
  }

  buscarPorId(
    id: number
  ): Observable<ApiResponse<Vaga>> {

    return this.http.get<ApiResponse<Vaga>>(
      `${this.apiUrl}/${id}`
    );
  }
}