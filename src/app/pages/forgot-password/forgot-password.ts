import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import {
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly http =
    inject(HttpClient);

  loading = false;

  successMessage = '';
  errorMessage = '';

  form =
    this.formBuilder.nonNullable.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]

    });

  submit(): void {

    this.successMessage = '';
    this.errorMessage = '';

    if (
      this.form.invalid
      || this.loading
    ) {

      this.form.markAllAsTouched();

      return;
    }

    const email =
      this.form.controls.email.value
        .trim()
        .toLowerCase();

    this.loading = true;

    this.http
      .post(
        `${environment.apiUrl}/auth/forgot-password`,
        {
          email
        }
      )
      .subscribe({

        next: () => {

          this.loading = false;

          /*
           * Mantemos uma mensagem genérica.
           * Assim não revelamos se o e-mail
           * existe ou não na plataforma.
           */
          this.successMessage =
            'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.';

          this.form.reset();
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          console.error(
            'Erro ao solicitar recuperação:',
            error
          );

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível solicitar a recuperação de senha.';
        }

      });
  }
}