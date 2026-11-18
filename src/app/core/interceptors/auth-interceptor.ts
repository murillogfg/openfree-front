import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  Observable,
  catchError,
  of,
  switchMap,
  throwError
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/*
 * Coloca o token nas chamadas para a NOSSA API e
 * renova o login sozinho quando ele vence:
 *
 * 1. Token vencendo + tem refresh token -> renova antes.
 * 2. API respondeu 401 -> tenta renovar uma vez e repete.
 * 3. Não deu para renovar -> volta para o login com aviso.
 */
export const authInterceptor:
  HttpInterceptorFn =
(
  request,
  next
) => {

  const authService =
    inject(AuthService);

  const isApiRequest =
    request.url.startsWith(
      environment.apiUrl
    );

  /*
   * Login, cadastro de senha, refresh etc. não levam
   * token nem disparam renovação.
   */
  const isAuthRoute =
    request.url.startsWith(
      `${environment.apiUrl}/auth/`
    );

  if (
    !isApiRequest
    || isAuthRoute
  ) {
    return next(request);
  }

  const comToken =
    (token: string | null): HttpRequest<unknown> =>
      token
        ? request.clone({
            setHeaders: {
              Authorization:
                `Bearer ${token}`
            }
          })
        : request;

  const renovar =
    (): Observable<string> =>
      authService
        .renovarSessao()
        .pipe(
          catchError(error => {
            authService.handleExpiredSession();
            return throwError(() => error);
          })
        );

  const precisaRenovarAntes =
    authService.accessTokenExpirando()
    && authService.hasRefreshToken();

  const token$: Observable<string | null> =
    precisaRenovarAntes
      ? renovar()
      : of(authService.getToken());

  return token$.pipe(

    switchMap(token =>

      next(comToken(token)).pipe(

        catchError((error: unknown) => {

          const deu401 =
            error instanceof HttpErrorResponse
            && error.status === 401;

          /*
           * Visitante sem login: um 401 não é
           * "sessão expirada", só repassamos o erro.
           */
          if (!deu401 || !token) {
            return throwError(() => error);
          }

          if (authService.hasRefreshToken()) {
            return renovar().pipe(
              switchMap(novoToken =>
                next(comToken(novoToken))
              )
            );
          }

          authService.handleExpiredSession();

          return throwError(() => error);
        })
      )
    )
  );
};
