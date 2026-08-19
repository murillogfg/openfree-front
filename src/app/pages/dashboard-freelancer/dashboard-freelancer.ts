import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { DashboardFreelancer as DashboardData } from '../../core/models/dashboard.models';
import { DashboardService } from '../../core/services/dashboard.service';

import { StatCard } from '../../shared/components/stat-card/stat-card';
imports: [
  CommonModule,
  RouterLink,
  StatCard
]
@Component({
  selector: 'app-dashboard-freelancer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard-freelancer.html',
  styleUrl: './dashboard-freelancer.css'
})
export class DashboardFreelancer implements OnInit {

  private readonly dashboardService =
    inject(DashboardService);

  dashboard: DashboardData | null = null;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService
      .getFreelancer()
      .subscribe({
        next: response => {
          this.dashboard = response.data;
          this.loading = false;
        },

        error: error => {
          this.loading = false;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível carregar o dashboard.';
        }
      });
  }

  get iniciais(): string {
    const nome = this.dashboard?.nomeUsuario?.trim();

    if (!nome) {
      return 'OF';
    }

    return nome
      .split(/\s+/)
      .slice(0, 2)
      .map(parte => parte.charAt(0))
      .join('')
      .toUpperCase();
  }

  get estrelas(): number[] {
    const media = this.dashboard?.avaliacaoMedia ?? 0;
    const quantidade = Math.round(media);

    return Array.from(
      { length: 5 },
      (_, index) => index < quantidade ? 1 : 0
    );
  }

  profileCompletion = 0;
profileReady = false;

calcularProgressoPerfil(profile: any): void {

  const campos = [
    profile.nome,
    profile.telefone,
    profile.tituloProfissional,
    profile.biografia,
    profile.cidade,
    profile.estado,
    profile.habilidades,
    profile.avatarUrl,
    profile.portfolioUrl
  ];

  const preenchidos =
    campos.filter(valor =>
      valor !== null
      && valor !== undefined
      && String(valor).trim() !== ''
    ).length;

  this.profileCompletion =
    Math.round(
      (preenchidos / campos.length) * 100
    );

  this.profileReady =
    this.profileCompletion >= 70;
}
}