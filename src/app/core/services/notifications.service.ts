import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  tap
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  ApiResponse
} from '../models/api-response';

import {
  Notification,
  UnreadNotificationCount
} from '../models/notification.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/notifications`;

  /*
   * Estado global do contador.
   *
   * MainLayout e página de notificações
   * podem observar o mesmo valor.
   */
  private readonly unreadCountSubject =
    new BehaviorSubject<number>(0);

  readonly unreadCount$ =
    this.unreadCountSubject
      .asObservable();

  listarTodas():
    Observable<ApiResponse<Notification[]>> {

    return this.http
      .get<ApiResponse<Notification[]>>(
        this.apiUrl
      )
      .pipe(
        tap(response => {

          const notifications =
            response.data ?? [];

          const unread =
            notifications.filter(
              notification =>
                !notification.lida
            ).length;

          this.setUnreadCount(
            unread
          );
        })
      );
  }

  listarNaoLidas():
    Observable<ApiResponse<Notification[]>> {

    return this.http
      .get<ApiResponse<Notification[]>>(
        `${this.apiUrl}/unread`
      )
      .pipe(
        tap(response => {

          this.setUnreadCount(
            response.data?.length ?? 0
          );
        })
      );
  }

  contarNaoLidas():
    Observable<
      ApiResponse<UnreadNotificationCount>
    > {

    return this.http
      .get<
        ApiResponse<UnreadNotificationCount>
      >(
        `${this.apiUrl}/unread/count`
      )
      .pipe(
        tap(response => {

          this.setUnreadCount(
            response.data?.quantidade ?? 0
          );
        })
      );
  }

  marcarComoLida(
    notificationId: number
  ): Observable<ApiResponse<Notification>> {

    return this.http
      .patch<ApiResponse<Notification>>(
        `${this.apiUrl}/${notificationId}/read`,
        {}
      )
      .pipe(
        tap(() => {

          const atual =
            this.unreadCountSubject.value;

          this.setUnreadCount(
            Math.max(
              0,
              atual - 1
            )
          );
        })
      );
  }

  atualizarContador(): void {

    this.contarNaoLidas()
      .subscribe({
        error: error => {

          console.error(
            'Não foi possível atualizar o contador de notificações:',
            error
          );

        }
      });
  }

  private setUnreadCount(
    quantidade: number
  ): void {

    this.unreadCountSubject.next(
      quantidade
    );
  }
}