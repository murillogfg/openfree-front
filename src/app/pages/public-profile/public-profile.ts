import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface publicProfile {
  id: number;

  nome: string;
  email: string;
  telefone: string | null;

  role: 'FREELANCER' | 'EMPRESA';

  tituloProfissional: string | null;
  biografia: string | null;

  cidade: string | null;
  estado: string | null;

  habilidades: string | null;

  avatarUrl: string | null;
  curriculoUrl: string | null;
  portfolioUrl: string | null;
}

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './public-profile.html',
  styleUrl: './public-profile.css'
})
export class PublicProfile implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly http =
    inject(HttpClient);

  readonly apiUrl =
    environment.apiUrl;

  usuarioId = 0;

  profile: PublicProfile | null = null;

  loading = true;
  errorMessage = '';
portfolioUrl: any;
cidade: any;
estado: any;
biografia: any;
nome: any;
tituloProfissional: any;

  ngOnInit(): void {

    this.usuarioId =
      Number(
        this.route.snapshot
          .paramMap
          .get('id')
      );

    if (
      !Number.isFinite(this.usuarioId)
      || this.usuarioId <= 0
    ) {

      this.loading = false;

      this.errorMessage =
        'Identificador do profissional inválido.';

      return;
    }

    this.carregar();
  }

  carregar(): void {

    this.loading = true;
    this.errorMessage = '';

    this.http
      .get<ApiResponse<PublicProfile>>(
        `${environment.apiUrl}/usuarios/${this.usuarioId}/profile`
      )
      .subscribe({

        next: response => {

          this.profile =
            response.data;

          this.loading = false;
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          console.error(
            'Erro ao carregar perfil público:',
            error
          );

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível carregar o perfil profissional.';
        }

      });
  }

  get avatarUrl(): string | null {

    const url =
      this.profile?.avatarUrl;

    if (!url) {
      return null;
    }

    if (url.startsWith('http')) {
      return url;
    }

    return `${this.apiUrl}${url}`;
  }

  get curriculoUrl(): string | null {

    const url =
      this.profile?.curriculoUrl;

    if (!url) {
      return null;
    }

    if (url.startsWith('http')) {
      return url;
    }

    return `${this.apiUrl}${url}`;
  }

  get habilidades(): string[] {

    const habilidades =
      this.profile?.habilidades;

    if (!habilidades) {
      return [];
    }

    return (habilidades as unknown as string)
      .split(',')
      .map(
        (        habilidade: string) =>
          habilidade.trim()
      )
      .filter(Boolean);
  }

  iniciais(): string {

    const nome =
      this.profile?.nome?.trim();

    if (!nome) {
      return 'OF';
    }

    const partes =
      nome.split(/\s+/);

    if (partes.length === 1) {
      return partes[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      partes[0].charAt(0)
      +
      partes[partes.length - 1]
        .charAt(0)
    ).toUpperCase();
  }
}