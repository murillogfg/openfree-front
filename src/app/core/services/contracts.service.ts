import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { Contract } from '../models/contract.models';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/contracts`;

  listarMeusContratos():
    Observable<ApiResponse<Contract[]>> {

    return this.http.get<ApiResponse<Contract[]>>(
      `${this.apiUrl}/me`
    );
  }

  listarContratosEmpresa():
    Observable<ApiResponse<Contract[]>> {

    return this.http.get<ApiResponse<Contract[]>>(
      `${this.apiUrl}/company`
    );
  }

  buscarPorId(
    id: number
  ): Observable<ApiResponse<Contract>> {

    return this.http.get<ApiResponse<Contract>>(
      `${this.apiUrl}/${id}`
    );
  }

  iniciar(
    id: number
  ): Observable<ApiResponse<Contract>> {

    return this.http.patch<ApiResponse<Contract>>(
      `${this.apiUrl}/${id}/start`,
      {}
    );
  }

  confirmarConclusaoEmpresa(
    id: number
  ): Observable<ApiResponse<Contract>> {

    return this.http.patch<ApiResponse<Contract>>(
      `${this.apiUrl}/${id}/complete/company`,
      {}
    );
  }

  confirmarConclusaoFreelancer(
    id: number
  ): Observable<ApiResponse<Contract>> {

    return this.http.patch<ApiResponse<Contract>>(
      `${this.apiUrl}/${id}/complete/freelancer`,
      {}
    );
  }
}