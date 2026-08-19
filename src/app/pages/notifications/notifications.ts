import { CommonModule } from '@angular/common';

import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { NotificationsService } from '../../core/services/notifications.service';

import {
  Notification,
  NotificationType
} from '../../core/models/notification.models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {

  private readonly notificationsService =
    inject(NotificationsService);

  notifications: Notification[] = [];

  loading = true;
  processingId: number | null = null;

  errorMessage = '';

  filtro: 'TODAS' | 'NAO_LIDAS' = 'TODAS';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {

    this.loading = true;
    this.errorMessage = '';

    this.notificationsService
      .listarTodas()
      .subscribe({

        next: response => {

          this.notifications =
            response.data ?? [];

          this.loading = false;
        },

        error: (error: HttpErrorResponse) => {

          this.loading = false;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível carregar as notificações.';
        }
      });
  }

  definirFiltro(
    filtro: 'TODAS' | 'NAO_LIDAS'
  ): void {

    this.filtro = filtro;
  }

  get notificationsFiltradas(): Notification[] {

    if (this.filtro === 'TODAS') {
      return this.notifications;
    }

    return this.notifications.filter(
      notification =>
        !notification.lida
    );
  }

  get quantidadeNaoLidas(): number {

    return this.notifications.filter(
      notification =>
        !notification.lida
    ).length;
  }

  marcarComoLida(
    notification: Notification
  ): void {

    if (
      notification.lida
      || this.processingId !== null
    ) {
      return;
    }

    this.processingId =
      notification.id;

    this.notificationsService
      .marcarComoLida(
        notification.id
      )
      .subscribe({

        next: response => {

          this.notifications =
            this.notifications.map(
              item =>
                item.id === response.data.id
                  ? response.data
                  : item
            );

          this.processingId = null;
        },

        error: (error: HttpErrorResponse) => {

          this.processingId = null;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível marcar a notificação como lida.';
        }
      });
  }

  icone(
    tipo: NotificationType
  ): string {

    switch (tipo) {
      case 'SUCCESS':
        return '✓';

      case 'WARNING':
        return '!';

      case 'ERROR':
        return '×';

      default:
        return 'i';
    }
  }
}