import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ApplicationsService } from '../../core/services/applications.service';

import {
  MyApplication,
  StatusCandidatura
} from '../../core/models/application.models';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './applications.html',
  styleUrl: './applications.css'
})
export class Applications implements OnInit {

  private readonly applicationsService =
    inject(ApplicationsService);

  applications: MyApplication[] = [];

  loading = true;
  errorMessage = '';

  filtro: StatusCandidatura | 'TODAS' = 'TODAS';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;
    this.errorMessage = '';

    this.applicationsService
      .listarMinhas()
      .subscribe({
        next: response => {
          this.applications =
            response.data ?? [];

          this.loading = false;
        },

        error: (error: HttpErrorResponse) => {
          this.loading = false;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível carregar suas candidaturas.';
        }
      });
  }

  definirFiltro(
    filtro: StatusCandidatura | 'TODAS'
  ): void {
    this.filtro = filtro;
  }

  get applicationsFiltradas(): MyApplication[] {

    if (this.filtro === 'TODAS') {
      return this.applications;
    }

    return this.applications.filter(
      application =>
        application.status === this.filtro
    );
  }

  get pendentes(): number {
    return this.contarStatus('PENDENTE');
  }

  get aceitas(): number {
    return this.contarStatus('ACEITA');
  }

  get recusadas(): number {
    return this.contarStatus('RECUSADA');
  }

  private contarStatus(
    status: StatusCandidatura
  ): number {

    return this.applications.filter(
      application =>
        application.status === status
    ).length;
  }
}