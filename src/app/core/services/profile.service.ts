import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';

import {
  CompanyProfile,
  FreelancerProfile,
  UpdateCompanyProfile,
  UpdateFreelancerProfile
} from '../models/profile.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getFreelancerProfile():
    Observable<ApiResponse<FreelancerProfile>> {

    return this.http.get<ApiResponse<FreelancerProfile>>(
      `${this.apiUrl}/usuarios/me`
    );
  }

  updateFreelancerProfile(
    request: UpdateFreelancerProfile
  ): Observable<ApiResponse<FreelancerProfile>> {

    return this.http.patch<ApiResponse<FreelancerProfile>>(
      `${this.apiUrl}/usuarios/me`,
      request
    );
  }

  getCompanyProfile():
    Observable<ApiResponse<CompanyProfile>> {

    return this.http.get<ApiResponse<CompanyProfile>>(
      `${this.apiUrl}/companies/me`
    );
  }

  updateCompanyProfile(
    request: UpdateCompanyProfile
  ): Observable<ApiResponse<CompanyProfile>> {

    return this.http.patch<ApiResponse<CompanyProfile>>(
      `${this.apiUrl}/companies/me`,
      request
    );
  }
}