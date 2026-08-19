import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MyApplication } from '../models/application.models';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import {
  Application,
  CreateApplicationRequest
} from '../models/application.models';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  candidatarSe(
    vagaId: number,
    request: CreateApplicationRequest
  ): Observable<ApiResponse<Application>> {

    return this.http.post<ApiResponse<Application>>(
      `${this.apiUrl}/jobs/${vagaId}/applications`,
      request
    );
  }

  listarPorVaga(
    vagaId: number
  ): Observable<ApiResponse<Application[]>> {

    return this.http.get<ApiResponse<Application[]>>(
      `${this.apiUrl}/jobs/${vagaId}/applications`
    );
  }

  aceitar(
    vagaId: number,
    candidaturaId: number
  ): Observable<ApiResponse<Application>> {

    return this.http.patch<ApiResponse<Application>>(
      `${this.apiUrl}/jobs/${vagaId}/applications/${candidaturaId}/accept`,
      {}
    );
  }

  recusar(
    vagaId: number,
    candidaturaId: number
  ): Observable<ApiResponse<Application>> {

    return this.http.patch<ApiResponse<Application>>(
      `${this.apiUrl}/jobs/${vagaId}/applications/${candidaturaId}/reject`,
      {}
    );
  }

  listarMinhas(): Observable<ApiResponse<MyApplication[]>> {
  return this.http.get<ApiResponse<MyApplication[]>>(
    `${this.apiUrl}/applications/me`
  );
}
}