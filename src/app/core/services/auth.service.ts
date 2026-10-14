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

    const token =
      this.getToken();

    if (!token) {
      return false;
    }

    if (this.isTokenExpired(token)) {

      this.clearSession();

      return false;
    }

    return true;
  }

  /*
   * Chamado quando a API responde 401 para uma
   * requisição autenticada (token expirado ou
   * inválido). Limpa a sessão e volta ao login
   * avisando o usuário.
   */
  handleExpiredSession(): void {

    if (!this.getToken()) {
      return;
    }

    this.clearSession();

    const returnUrl =
      this.router.url;

    this.router.navigate(
      ['/login'],
      {
        queryParams: {
          sessionExpired: 1,
          returnUrl:
            returnUrl.startsWith('/login')
              ? null
              : returnUrl
        }
      }
    );
  }

  /*
   * Lê o campo "exp" do JWT (em segundos).
   * Considera expirado com 30s de folga para
   * evitar requisições que falhariam no caminho.
   */
  private isTokenExpired(
    token: string
  ): boolean {

    try {

      const payload =
        token.split('.')[1];

      const json =
        atob(
          payload
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        );

      const exp =
        JSON.parse(json).exp;

      if (typeof exp !== 'number') {
        return false;
      }

      return Date.now() >= (exp * 1000) - 30_000;

    } catch {

      return true;
    }
  }

  private clearSession(): void {

    localStorage.removeItem(
      this.tokenKey
    );

    localStorage.removeItem(
      this.roleKey
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

    this.clearSession();

    this.router.navigate([
      '/login'
    ]);
  }
}