import {
  Component,
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

import {
  CommonModule
} from '@angular/common';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  AuthService
} from '../../core/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  private readonly route =
    inject(ActivatedRoute);

  readonly router =
    inject(Router);


  loading =
    false;

  errorMessage =
    '';


  loginForm =
    this.formBuilder
      .nonNullable
      .group({

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        senha: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ]
      });


  submit(): void {

    if (
      this.loginForm.invalid
      || this.loading
    ) {

      this.loginForm
        .markAllAsTouched();

      return;
    }

    this.loading =
      true;

    this.errorMessage =
      '';

    this.authService
      .login(
        this.loginForm
          .getRawValue()
      )
      .subscribe({

        next: response => {

          const returnUrl =
            this.route
              .snapshot
              .queryParamMap
              .get('returnUrl');

          const dashboard =
            response.role === 'EMPRESA'
              ? '/dashboard/company'
              : '/dashboard/freelancer';

          const destino =
            this.isSafeReturnUrl(
              returnUrl
            )
              ? returnUrl!
              : dashboard;

          this.router
            .navigateByUrl(
              destino
            )
            .then(() => {

              this.loading =
                false;
            });
        },

        error: (
          error: HttpErrorResponse
        ) => {

          console.error(
            'Erro no login:',
            error
          );

          this.loading =
            false;

          this.errorMessage =
            error.error?.message
            ?? error.error?.error
            ?? 'Não foi possível realizar o login.';
        }
      });
  }


  /*
   * Evita aceitar redirecionamento externo.
   *
   * Somente URLs internas iniciadas por uma
   * única barra podem ser usadas como returnUrl.
   */
  private isSafeReturnUrl(
    returnUrl: string | null
  ): boolean {

    if (
      !returnUrl
    ) {
      return false;
    }

    return (
      returnUrl.startsWith('/')
      && !returnUrl.startsWith('//')
      && !returnUrl.startsWith('/login')
    );
  }
}