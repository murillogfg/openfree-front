import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';

import { ApplicationsService } from '../../core/services/applications.service';
import { Application } from '../../core/models/application.models';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './job-applications.html',
  styleUrl: './job-applications.css'
})
export class JobApplications implements OnInit {

  private readonly route = inject(ActivatedRoute);

  private readonly applicationsService =
    inject(ApplicationsService);

  vagaId = 0;

  applications: Application[] = [];

  loading = true;
  updatingId: number | null = null;

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {

    this.vagaId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (
      !Number.isFinite(this.vagaId)
      || this.vagaId <= 0
    ) {
      this.loading = false;

      this.errorMessage =
        'Identificador da vaga inválido.';

      return;
    }

    this.carregar();
  }

  carregar(): void {

    this.loading = true;
    this.errorMessage = '';

    this.applicationsService
      .listarPorVaga(this.vagaId)
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
            ?? 'Não foi possível carregar os candidatos.';
        }
      });
  }

  aceitar(
    candidatura: Application
  ): void {

    if (
      this.updatingId !== null
      || candidatura.status === 'ACEITA'
    ) {
      return;
    }

    this.updatingId = candidatura.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.applicationsService
      .aceitar(
        this.vagaId,
        candidatura.id
      )
      .subscribe({
        next: response => {

          candidatura.status =
            response.data.status;

          this.successMessage =
            `${candidatura.nome} foi aceito(a) para esta vaga.`;
        },

        error: (error: HttpErrorResponse) => {

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível  a candidatura.';

          this.updatingId = null;
        },

        complete: () => {
          this.updatingId = null;
        }
      });
  }

  recusar(
    candidatura: Application
  ): void {

    if (
      this.updatingId !== null
      || candidatura.status === 'RECUSADA'
    ) {
      return;
    }

    this.updatingId = candidatura.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.applicationsService
      .recusar(
        this.vagaId,
        candidatura.id
      )
      .subscribe({
        next: response => {

          candidatura.status =
            response.data.status;

          this.successMessage =
            `${candidatura.nome} foi recusado(a).`;
        },

        error: (error: HttpErrorResponse) => {

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível recusar a candidatura.';

          this.updatingId = null;
        },

        complete: () => {
          this.updatingId = null;
        }
      });
  }

  get pendentes(): number {

    return this.applications.filter(
      application =>
        application.status === 'PENDENTE'
    ).length;
  }

  get aceitas(): number {

    return this.applications.filter(
      application =>
        application.status === 'ACEITA'
    ).length;
  }

  get recusadas(): number {

    return this.applications.filter(
      application =>
        application.status === 'RECUSADA'
    ).length;
  }
}