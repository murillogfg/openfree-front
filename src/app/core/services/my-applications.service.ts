import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { ApiResponse } from '../models/api-response';

import { MyApplication } from '../models/application.models';

@Injectable({
  providedIn: 'root'
})
export class MyApplicationsService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/applications`;

  listarMinhas(): Observable<ApiResponse<MyApplication[]>> {

    return this.http.get<ApiResponse<MyApplication[]>>(
      `${this.apiUrl}/me`
    );

  }

}