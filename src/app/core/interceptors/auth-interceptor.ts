import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  catchError,
  throwError
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const authInterceptor:
  HttpInterceptorFn =
(
  request,
  next
) => {

  const authService =
    inject(AuthService);

  const token =
    authService.getToken();

  /*
   * Só enviamos o token para a nossa API,
   * nunca para serviços de terceiros.
   */
  const isApiRequest =
    request.url.startsWith(
      environment.apiUrl
    );

  if (
    !token
    || !isApiRequest
  ) {
    return next(request);
  }

  const authenticatedRequest =
    request.clone({

      setHeaders: {
        Authorization:
          `Bearer ${token}`
      }

    });

  return next(
    authenticatedRequest
  ).pipe(

    catchError((error: unknown) => {

      /*
       * 401 numa requisição que levou token
       * significa sessão expirada ou inválida.
       */
      if (
        error instanceof HttpErrorResponse
        && error.status === 401
        && !request.url.includes('/auth/login')
      ) {
        authService.handleExpiredSession();
      }

      return throwError(() => error);
    })
  );
};
