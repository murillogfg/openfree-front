import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response';
import { UploadResponse } from '../models/profile.models';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl =
    `${environment.apiUrl}/uploads`;

  uploadAvatar(
    file: File
  ): Observable<ApiResponse<UploadResponse>> {

    return this.upload(
      '/avatar',
      file
    );
  }

  uploadCurriculum(
    file: File
  ): Observable<ApiResponse<UploadResponse>> {

    return this.upload(
      '/curriculum',
      file
    );
  }

  uploadCompanyLogo(
    file: File
  ): Observable<ApiResponse<UploadResponse>> {

    return this.upload(
      '/company-logo',
      file
    );
  }

  private upload(
    endpoint: string,
    file: File
  ): Observable<ApiResponse<UploadResponse>> {

    const formData = new FormData();

    formData.append(
      'file',
      file
    );

    return this.http.post<ApiResponse<UploadResponse>>(
      `${this.apiUrl}${endpoint}`,
      formData
    );
  }
}