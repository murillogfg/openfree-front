import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  LoginRequest,
  LoginResponse,
  UserRole
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http =
    inject(HttpClient);

  private readonly router =
    inject(Router);

  private readonly apiUrl =
    `${environment.apiUrl}/auth`;

  private readonly tokenKey =
    'openfree_token';

  private readonly roleKey =
    'openfree_role';

  login(
    request: LoginRequest
  ): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        request
      )
      .pipe(
        tap(response => {

          localStorage.setItem(
            this.tokenKey,
            response.token
          );

          localStorage.setItem(
            this.roleKey,
            response.role
          );

        })
      );
  }

  getToken(): string | null {

    return localStorage.getItem(
      this.tokenKey
    );
  }

  getRole(): UserRole | null {

    const role =
      localStorage.getItem(
        this.roleKey
      );

    if (
      role === 'FREELANCER'
      || role === 'EMPRESA'
    ) {
      return role;
    }

    return null;
  }

  isAuthenticated(): boolean {

    return Boolean(
      this.getToken()
    );
  }

  isCompany(): boolean {

    return (
      this.getRole()
      === 'EMPRESA'
    );
  }

  isFreelancer(): boolean {

    return (
      this.getRole()
      === 'FREELANCER'
    );
  }

  getDefaultDashboard(): string {

    return this.isCompany()
      ? '/dashboard/company'
      : '/dashboard/freelancer';
  }

  logout(): void {

    localStorage.removeItem(
      this.tokenKey
    );

    localStorage.removeItem(
      this.roleKey
    );

    this.router.navigate([
      '/login'
    ]);
  }
}