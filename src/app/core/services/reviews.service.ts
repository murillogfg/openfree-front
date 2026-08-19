import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';

import {
  CreateReviewRequest,
  RatingSummary,
  Review
} from '../models/review.models';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/reviews`;

  avaliarFreelancer(
    candidaturaId: number,
    request: CreateReviewRequest
  ): Observable<ApiResponse<Review>> {

    return this.http.post<ApiResponse<Review>>(
      `${this.apiUrl}/applications/${candidaturaId}/freelancer`,
      request
    );
  }

  avaliarEmpresa(
    candidaturaId: number,
    request: CreateReviewRequest
  ): Observable<ApiResponse<Review>> {

    return this.http.post<ApiResponse<Review>>(
      `${this.apiUrl}/applications/${candidaturaId}/company`,
      request
    );
  }

  listarAvaliacoesUsuario(
    usuarioId: number
  ): Observable<ApiResponse<Review[]>> {

    return this.http.get<ApiResponse<Review[]>>(
      `${this.apiUrl}/users/${usuarioId}`
    );
  }

  listarAvaliacoesEmpresa(
    empresaId: number
  ): Observable<ApiResponse<Review[]>> {

    return this.http.get<ApiResponse<Review[]>>(
      `${this.apiUrl}/companies/${empresaId}`
    );
  }

  resumoUsuario(
    usuarioId: number
  ): Observable<ApiResponse<RatingSummary>> {

    return this.http.get<ApiResponse<RatingSummary>>(
      `${this.apiUrl}/users/${usuarioId}/summary`
    );
  }

  resumoEmpresa(
    empresaId: number
  ): Observable<ApiResponse<RatingSummary>> {

    return this.http.get<ApiResponse<RatingSummary>>(
      `${this.apiUrl}/companies/${empresaId}/summary`
    );
  }
}