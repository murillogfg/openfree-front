import { Injectable, inject } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  ApiResponse
} from '../models/api-response';

import {
  Favorite
} from '../models/favorite.models';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    environment.apiUrl;

  listar():
    Observable<ApiResponse<Favorite[]>> {

    return this.http.get<
      ApiResponse<Favorite[]>
    >(
      `${this.apiUrl}/favorites`
    );
  }

  favoritar(
    vagaId: number
  ): Observable<ApiResponse<Favorite>> {

    return this.http.post<
      ApiResponse<Favorite>
    >(
      `${this.apiUrl}/jobs/${vagaId}/favorite`,
      {}
    );
  }

  desfavoritar(
    vagaId: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/jobs/${vagaId}/favorite`
    );
  }
}