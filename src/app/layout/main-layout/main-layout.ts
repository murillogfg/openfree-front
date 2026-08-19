import {
  Component,
  DestroyRef,
  OnInit,
  inject
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { NotificationsService } from '../../core/services/notifications.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit {

  private readonly authService =
    inject(AuthService);

  private readonly profileService =
    inject(ProfileService);

  private readonly notificationsService =
    inject(NotificationsService);

  private readonly destroyRef =
    inject(DestroyRef);

  sidebarOpen = false;

  displayName = '';
  displayInitials = 'OF';

  unreadNotifications = 0;

  ngOnInit(): void {

    this.carregarIdentidade();

    this.observarNotificacoes();

    /*
     * Faz a primeira consulta ao backend.
     * Depois disso, alterações no service
     * atualizam o layout automaticamente.
     */
    this.notificationsService
      .atualizarContador();
  }

  get isCompany(): boolean {

    return this.authService
      .isCompany();
  }

  get isFreelancer(): boolean {

    return this.authService
      .isFreelancer();
  }

  get dashboardRoute(): string {

    return this.authService
      .getDefaultDashboard();
  }

  get tipoConta(): string {

    return this.isCompany
      ? 'Empresa'
      : 'Freelancer';
  }

  private carregarIdentidade(): void {

    if (this.isCompany) {

      this.profileService
        .getCompanyProfile()
        .subscribe({

          next: response => {

            this.displayName =
              response.data?.nomeFantasia
              ?? 'Empresa';

            this.displayInitials =
              this.criarIniciais(
                this.displayName
              );
          },

          error: error => {

            console.error(
              'Erro ao carregar empresa no layout:',
              error
            );

            this.displayName =
              'Empresa';

            this.displayInitials =
              'EM';
          }

        });

      return;
    }

    this.profileService
      .getFreelancerProfile()
      .subscribe({

        next: response => {

          this.displayName =
            response.data?.nome
            ?? 'Profissional';

          this.displayInitials =
            this.criarIniciais(
              this.displayName
            );
        },

        error: error => {

          console.error(
            'Erro ao carregar usuário no layout:',
            error
          );

          this.displayName =
            'Profissional';

          this.displayInitials =
            'PF';
        }

      });
  }

  private observarNotificacoes(): void {

    this.notificationsService
      .unreadCount$
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe(
        quantidade => {

          this.unreadNotifications =
            quantidade;
        }
      );
  }

  private criarIniciais(
    nome: string
  ): string {

    const partes =
      nome
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (partes.length === 0) {
      return 'OF';
    }

    if (partes.length === 1) {

      return partes[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      partes[0][0]
      +
      partes[
        partes.length - 1
      ][0]
    ).toUpperCase();
  }

  toggleSidebar(): void {

    this.sidebarOpen =
      !this.sidebarOpen;
  }

  closeSidebar(): void {

    this.sidebarOpen =
      false;
  }

  logout(): void {

    this.authService.logout();
  }
}