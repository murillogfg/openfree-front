import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';

import {
  Company,
  CreateCompanyRequest
} from '../models/company.models';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/companies`;

  criar(
    request: CreateCompanyRequest
  ): Observable<ApiResponse<Company>> {

    return this.http.post<ApiResponse<Company>>(
      this.apiUrl,
      request
    );
  }

  buscarMinhaEmpresa():
    Observable<ApiResponse<Company>> {

    return this.http.get<ApiResponse<Company>>(
      `${this.apiUrl}/me`
    );
  }
}