import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { DashboardEmpresa } from '../../core/models/dashboard.models';
import { DashboardService } from '../../core/services/dashboard.service';
import { StatCard } from '../../shared/components/stat-card/stat-card';

@Component({
  selector: 'app-dashboard-company',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    StatCard
  ],
  templateUrl: './dashboard-company.html',
  styleUrl: './dashboard-company.css'
})
export class DashboardCompany implements OnInit {

  private readonly dashboardService =
    inject(DashboardService);

  dashboard: DashboardEmpresa | null = null;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService
      .getCompany()
      .subscribe({
        next: response => {
          this.dashboard = response.data;
          this.loading = false;
        },

        error: error => {
          this.loading = false;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível carregar o dashboard da empresa.';
        }
      });
  }

  get taxaFormatada(): string {
    const taxa = this.dashboard?.taxaContratacao ?? 0;

    return `${taxa.toFixed(1)}%`;
  }

  get estrelas(): number[] {
    const media =
      this.dashboard?.avaliacaoMedia ?? 0;

    const quantidade = Math.round(media);

    return Array.from(
      { length: 5 },
      (_, index) =>
        index < quantidade ? 1 : 0
    );
  }
}