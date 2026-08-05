import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import {
  DashboardEmpresa,
  DashboardFreelancer
} from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  getFreelancer(): Observable<ApiResponse<DashboardFreelancer>> {
    return this.http.get<ApiResponse<DashboardFreelancer>>(
      `${this.apiUrl}/freelancer`
    );
  }

  getCompany(): Observable<ApiResponse<DashboardEmpresa>> {
    return this.http.get<ApiResponse<DashboardEmpresa>>(
      `${this.apiUrl}/company`
    );
  }
}