import { CommonModule } from '@angular/common';

import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';

import {
  HttpErrorResponse
} from '@angular/common/http';

import { AuthService } from '../../core/services/auth.service';

import { JobCard } from '../../shared/components/job-card/job-card';

import {
  PageResponse,
  Vaga
} from '../../core/models/job.models';

import { JobsService } from '../../core/services/jobs.service';

import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  selector: 'app-jobs',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    JobCard
  ],

  templateUrl: './jobs.html',
  styleUrl: './jobs.css'
})
export class Jobs implements OnInit {

  private readonly jobsService =
    inject(JobsService);

  private readonly favoritesService =
    inject(FavoritesService);

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  pagina: PageResponse<Vaga> | null = null;

  loading = true;

  errorMessage = '';
  successMessage = '';

  favoriteIds =
    new Set<number>();

  favoriteLoadingId:
    number | null = null;

  filtroForm =
    this.formBuilder
      .nonNullable
      .group({

        titulo: [''],

        cidade: [''],

        estado: ['']
      });

  ngOnInit(): void {

    if (!this.isCompany) {
      this.carregarFavoritos();
    }

    this.buscarVagas();
  }

  buscarVagas(
    page = 0
  ): void {

    this.loading = true;
    this.errorMessage = '';

    const filtro =
      this.filtroForm
        .getRawValue();

    this.jobsService
      .buscar({
        ...filtro,

        status: 'PUBLICADA',

        page,

        size: 9,

        sort: 'createdAt,desc'
      })
      .subscribe({

        next: response => {

          this.pagina =
            response.data;

          this.loading = false;
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível carregar as vagas.';
        }
      });
  }

  private carregarFavoritos(): void {

    this.favoritesService
      .listar()
      .subscribe({

        next: response => {

          const favoritos =
            response.data ?? [];

          this.favoriteIds =
            new Set(
              favoritos.map(
                favorite =>
                  favorite.vagaId
              )
            );
        },

        error: error => {

          console.error(
            'Não foi possível carregar favoritos:',
            error
          );

          /*
           * Não bloqueamos a tela de vagas
           * se favoritos falhar.
           */
        }

      });
  }

  isFavorita(
    vagaId: number
  ): boolean {

    return this.favoriteIds
      .has(vagaId);
  }

  alternarFavorito(
    job: Vaga
  ): void {

    if (
      this.isCompany
      || this.favoriteLoadingId !== null
    ) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.favoriteLoadingId =
      job.id;

    if (
      this.isFavorita(job.id)
    ) {

      this.removerFavorito(job);

      return;
    }

    this.adicionarFavorito(job);
  }

  private adicionarFavorito(
    job: Vaga
  ): void {

    this.favoritesService
      .favoritar(job.id)
      .subscribe({

        next: () => {

          this.favoriteIds.add(
            job.id
          );

          /*
           * Cria novo Set para deixar
           * a mudança explícita para
           * a detecção do Angular.
           */
          this.favoriteIds =
            new Set(
              this.favoriteIds
            );

          this.favoriteLoadingId =
            null;

          this.successMessage =
            'Vaga adicionada aos favoritos.';
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.favoriteLoadingId =
            null;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível favoritar a vaga.';
        }

      });
  }

  private removerFavorito(
    job: Vaga
  ): void {

    this.favoritesService
      .desfavoritar(job.id)
      .subscribe({

        next: () => {

          this.favoriteIds.delete(
            job.id
          );

          this.favoriteIds =
            new Set(
              this.favoriteIds
            );

          this.favoriteLoadingId =
            null;

          this.successMessage =
            'Vaga removida dos favoritos.';
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.favoriteLoadingId =
            null;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível remover a vaga dos favoritos.';
        }

      });
  }

  limparFiltros(): void {

    this.filtroForm.reset({
      titulo: '',
      cidade: '',
      estado: ''
    });

    this.buscarVagas();
  }

  paginaAnterior(): void {

    if (
      this.pagina
      && !this.pagina.first
    ) {

      this.buscarVagas(
        this.pagina.page - 1
      );
    }
  }

  proximaPagina(): void {

    if (
      this.pagina
      && !this.pagina.last
    ) {

      this.buscarVagas(
        this.pagina.page + 1
      );
    }
  }

  get isCompany(): boolean {

    return this.authService
      .isCompany();
  }
}