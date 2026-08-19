import { CommonModule } from '@angular/common';

import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  FavoritesService
} from '../../core/services/favorites.service';

import {
  Favorite
} from '../../core/models/favorite.models';

@Component({
  selector: 'app-favorites',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit {

  private readonly favoritesService =
    inject(FavoritesService);

  favorites: Favorite[] = [];

  loading = true;

  removingId: number | null = null;

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {

    this.loading = true;
    this.errorMessage = '';

    this.favoritesService
      .listar()
      .subscribe({

        next: response => {

          this.favorites =
            response.data ?? [];

          this.loading = false;
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          console.error(
            'Erro ao carregar favoritos:',
            error
          );

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível carregar seus favoritos.';
        }

      });
  }

  remover(
    favorite: Favorite
  ): void {

    if (
      this.removingId !== null
    ) {
      return;
    }

    this.removingId =
      favorite.id;

    this.errorMessage = '';
    this.successMessage = '';

    this.favoritesService
      .desfavoritar(
        favorite.vagaId
      )
      .subscribe({

        next: () => {

          this.favorites =
            this.favorites.filter(
              item =>
                item.id !== favorite.id
            );

          this.removingId = null;

          this.successMessage =
            'Vaga removida dos favoritos.';
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.removingId = null;

          console.error(
            'Erro ao remover favorito:',
            error
          );

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível remover a vaga dos favoritos.';
        }

      });
  }

  get total(): number {
    return this.favorites.length;
  }
}