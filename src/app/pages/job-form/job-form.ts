import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CreatedJob {
  id: number;
}

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './job-form.html',
  styleUrl: './job-form.css'
})
export class JobForm {

  private readonly fb =
    inject(FormBuilder);

  private readonly http =
    inject(HttpClient);

  private readonly router =
    inject(Router);

  private readonly apiUrl =
    `${environment.apiUrl}/jobs`;

  loading = false;

  errorMessage = '';
  successMessage = '';

  form =
    this.fb.nonNullable.group({

      titulo: [
        '',
        [
          Validators.required,
          Validators.maxLength(120)
        ]
      ],

      descricao: [
        '',
        [
          Validators.required
        ]
      ],

      requisitos: [
        '',
        [
          Validators.maxLength(1000)
        ]
      ],

      cidade: [
        '',
        [
          Validators.required
        ]
      ],

      estado: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(2)
        ]
      ],

      valor: [
        0,
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],

      quantidadePessoas: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      dataServico: [
        '',
        [
          Validators.required
        ]
      ],

      horarioInicio: [
        '',
        [
          Validators.required
        ]
      ],

      horarioFim: [
        '',
        [
          Validators.required
        ]
      ]

    });

  publicar(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (
      this.form.invalid
      || this.loading
    ) {

      this.form.markAllAsTouched();

      this.errorMessage =
        'Preencha corretamente os campos obrigatórios.';

      return;
    }

    const formValue =
      this.form.getRawValue();

    if (
      formValue.horarioFim
      <= formValue.horarioInicio
    ) {

      this.errorMessage =
        'O horário de término deve ser posterior ao horário de início.';

      return;
    }

    const payload = {

      titulo:
        formValue.titulo.trim(),

      descricao:
        formValue.descricao.trim(),

      requisitos:
        formValue.requisitos.trim()
        || null,

      cidade:
        formValue.cidade.trim(),

      estado:
        formValue.estado
          .trim()
          .toUpperCase(),

      valor:
        Number(formValue.valor),

      quantidadePessoas:
        Number(
          formValue.quantidadePessoas
        ),

      dataServico:
        formValue.dataServico,

      horarioInicio:
        formValue.horarioInicio,

      horarioFim:
        formValue.horarioFim

    };

    this.loading = true;

    this.http
      .post<ApiResponse<CreatedJob>>(
        this.apiUrl,
        payload
      )
      .subscribe({

        next: response => {

          const vagaId =
            response.data.id;

          this.publicarVagaCriada(
            vagaId
          );
        },

        error: error => {

          this.loading = false;

          console.error(
            'Erro ao criar vaga:',
            error
          );

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível criar a vaga.';
        }

      });
  }

  private publicarVagaCriada(
    vagaId: number
  ): void {

    this.http
      .patch(
        `${this.apiUrl}/${vagaId}/publicar`,
        {}
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.successMessage =
            'Vaga publicada com sucesso.';

          setTimeout(() => {

            this.router.navigate([
              '/jobs'
            ]);

          }, 800);
        },

        error: error => {

          this.loading = false;

          console.error(
            'A vaga foi criada, mas não foi publicada:',
            error
          );

          this.errorMessage =
            error.error?.message
            ?? 'A vaga foi criada como rascunho, mas não foi possível publicá-la.';
        }

      });
  }

  cancelar(): void {

    this.router.navigate([
      '/jobs'
    ]);
  }
}