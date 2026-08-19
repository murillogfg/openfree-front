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

import { CompaniesService } from '../../core/services/companies.service';




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

    private readonly companiesService =
  inject(CompaniesService);
  dashboard: DashboardEmpresa | null = null;

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.carregarDashboard();
    this.carregarEmpresa();
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
  companyProfileCompletion = 0;
companyProfileReady = false;

calcularProgressoEmpresa(empresa: any): void {

  const campos = [
    empresa.razaoSocial,
    empresa.nomeFantasia,
    empresa.cnpj,
    empresa.email,
    empresa.telefone,
    empresa.descricao,
    empresa.cidade,
    empresa.estado,
    empresa.site,
    empresa.logo
  ];

  const preenchidos =
    campos.filter(valor =>
      valor !== null
      && valor !== undefined
      && String(valor).trim() !== ''
    ).length;

  this.companyProfileCompletion =
    Math.round(
      (preenchidos / campos.length) * 100
    );

  this.companyProfileReady =
    this.companyProfileCompletion >= 70;
}
carregarEmpresa(): void {

  this.companiesService
    .buscarMinhaEmpresa()
    .subscribe({

      next: response => {

        this.calcularProgressoEmpresa(
          response.data
        );
      },

      error: error => {

        console.error(
          'Erro ao carregar empresa:',
          error
        );
      }

    });
}
}