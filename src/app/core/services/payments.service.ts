import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import {
  Payment,
  PaymentMethod
} from '../models/payment.models';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/payments`;

  listarMeusPagamentos():
    Observable<ApiResponse<Payment[]>> {

    return this.http.get<ApiResponse<Payment[]>>(
      `${this.apiUrl}/me`
    );
  }

  listarPagamentosEmpresa():
    Observable<ApiResponse<Payment[]>> {

    return this.http.get<ApiResponse<Payment[]>>(
      `${this.apiUrl}/company`
    );
  }

  buscarPorId(
    id: number
  ): Observable<ApiResponse<Payment>> {

    return this.http.get<ApiResponse<Payment>>(
      `${this.apiUrl}/${id}`
    );
  }

  simularPagamento(
    id: number,
    metodo: PaymentMethod
  ): Observable<ApiResponse<Payment>> {

    return this.http.post<ApiResponse<Payment>>(
      `${this.apiUrl}/${id}/simulate-payment`,
      {
        metodo
      }
    );
  }

  liberarPagamento(
    id: number
  ): Observable<ApiResponse<Payment>> {

    return this.http.patch<ApiResponse<Payment>>(
      `${this.apiUrl}/${id}/release`,
      {}
    );
  }
}