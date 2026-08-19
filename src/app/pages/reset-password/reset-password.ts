import { CommonModule } from '@angular/common';

import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly http =
    inject(HttpClient);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  token = '';

  loading = false;
  success = false;

  successMessage = '';
  errorMessage = '';

  form =
    this.formBuilder.nonNullable.group({

      novaSenha: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100)
        ]
      ],

      confirmarSenha: [
        '',
        [
          Validators.required
        ]
      ]

    });

  ngOnInit(): void {

    this.token =
      this.route.snapshot.queryParamMap
        .get('token')
      ?? '';

    if (!this.token) {

      this.errorMessage =
        'O link de recuperação é inválido ou não possui um token.';
    }
  }

  submit(): void {

    this.successMessage = '';
    this.errorMessage = '';

    if (!this.token) {

      this.errorMessage =
        'Token de recuperação inválido. Solicite um novo link.';

      return;
    }

    if (
      this.form.invalid
      || this.loading
    ) {

      this.form.markAllAsTouched();

      return;
    }

    const formValue =
      this.form.getRawValue();

    if (
      formValue.novaSenha
      !== formValue.confirmarSenha
    ) {

      this.errorMessage =
        'As senhas não coincidem.';

      return;
    }

    this.loading = true;

    this.http
      .post(
        `${environment.apiUrl}/auth/reset-password`,
        {
          token: this.token,
          novaSenha: formValue.novaSenha
        }
      )
      .subscribe({

        next: () => {

          this.loading = false;
          this.success = true;

          this.successMessage =
            'Sua senha foi redefinida com sucesso.';

          this.form.disable();

          setTimeout(() => {

            this.router.navigate([
              '/login'
            ]);

          }, 1800);
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          console.error(
            'Erro ao redefinir senha:',
            error
          );

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível redefinir sua senha.';
        }

      });
  }
}