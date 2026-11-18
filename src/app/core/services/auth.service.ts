import { Injectable, inject } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import {
  Observable,
  finalize,
  map,
  shareReplay,
  tap,
  throwError
} from 'rxjs';

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

  /*
   * Cliente HTTP "cru", sem os interceptors.
   * Usado no refresh/logout para não entrar em loop
   * com o interceptor que chama o próprio refresh.
   */
  private readonly httpSemInterceptor =
    new HttpClient(inject(HttpBackend));

  private readonly router =
    inject(Router);

  private readonly apiUrl =
    `${environment.apiUrl}/auth`;

  private readonly tokenKey =
    'openfree_token';

  private readonly roleKey =
    'openfree_role';

  private readonly refreshKey =
    'openfree_refresh';

  /*
   * Renovação em andamento. Se várias requisições
   * descobrirem ao mesmo tempo que o login venceu,
   * todas esperam a MESMA renovação (o refresh token
   * só pode ser usado uma vez).
   */
  private renovacaoEmAndamento:
    Observable<string> | null = null;

  login(
    request: LoginRequest
  ): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        request
      )
      .pipe(
        tap(response =>
          this.salvarSessao(response)
        )
      );
  }

  getToken(): string | null {

    return localStorage.getItem(
      this.tokenKey
    );
  }

  hasRefreshToken(): boolean {

    return Boolean(
      localStorage.getItem(
        this.refreshKey
      )
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

  /*
   * Logado = tem um login válido OU pode renová-lo.
   * Assim a pessoa não cai na tela de login só porque
   * o token de 1 hora venceu.
   */
  isAuthenticated(): boolean {

    const token =
      this.getToken();

    if (
      token
      && !this.isTokenExpired(token)
    ) {
      return true;
    }

    if (this.hasRefreshToken()) {
      return true;
    }

    if (token) {
      this.clearSession();
    }

    return false;
  }

  /*
   * O token atual vence nos próximos segundos?
   * Usado pelo interceptor para renovar antes.
   */
  accessTokenExpirando(): boolean {

    const token =
      this.getToken();

    return !token
      || this.isTokenExpired(token);
  }

  /*
   * Troca o refresh token por um login novo.
   * Devolve o novo token de acesso.
   */
  renovarSessao(): Observable<string> {

    const refreshToken =
      localStorage.getItem(
        this.refreshKey
      );

    if (!refreshToken) {
      return throwError(() =>
        new Error('Sem refresh token.')
      );
    }

    if (!this.renovacaoEmAndamento) {

      this.renovacaoEmAndamento =
        this.httpSemInterceptor
          .post<LoginResponse>(
            `${this.apiUrl}/refresh`,
            { refreshToken }
          )
          .pipe(
            tap(response =>
              this.salvarSessao(response)
            ),
            map(response =>
              response.token
            ),
            finalize(() => {
              this.renovacaoEmAndamento = null;
            }),
            shareReplay(1)
          );
    }

    return this.renovacaoEmAndamento;
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

  /*
   * Chamado quando não dá mais para renovar o login
   * (refresh token vencido, revogado ou ausente).
   */
  handleExpiredSession(): void {

    if (
      !this.getToken()
      && !this.hasRefreshToken()
    ) {
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

  logout(): void {

    const refreshToken =
      localStorage.getItem(
        this.refreshKey
      );

    /*
     * Avisa a API para invalidar a sessão deste
     * aparelho. Se falhar (sem internet), saímos
     * mesmo assim.
     */
    if (refreshToken) {
      this.httpSemInterceptor
        .post(
          `${this.apiUrl}/logout`,
          { refreshToken }
        )
        .subscribe({
          error: () => undefined
        });
    }

    this.clearSession();

    this.router.navigate([
      '/login'
    ]);
  }

  private salvarSessao(
    response: LoginResponse
  ): void {

    localStorage.setItem(
      this.tokenKey,
      response.token
    );

    localStorage.setItem(
      this.roleKey,
      response.role
    );

    if (response.refreshToken) {
      localStorage.setItem(
        this.refreshKey,
        response.refreshToken
      );
    }
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

    localStorage.removeItem(
      this.refreshKey
    );
  }
}
