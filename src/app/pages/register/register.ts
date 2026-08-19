import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
  Router,
  RouterLink
} from '@angular/router';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly http =
    inject(HttpClient);

  private readonly router =
    inject(Router);

  loading = false;

  errorMessage = '';
  successMessage = '';

  registerForm =
    this.formBuilder.nonNullable.group({

      nome: [
        '',
        [
          Validators.required
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      telefone: [
        ''
      ],

      senha: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmarSenha: [
        '',
        [
          Validators.required
        ]
      ]

    });

  submit(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (
      this.registerForm.invalid
      || this.loading
    ) {

      this.registerForm.markAllAsTouched();

      return;
    }

    const formValue =
      this.registerForm.getRawValue();

    if (
      formValue.senha
      !== formValue.confirmarSenha
    ) {

      this.errorMessage =
        'As senhas não coincidem.';

      return;
    }

    const request = {

      nome:
        formValue.nome.trim(),

      email:
        formValue.email
          .trim()
          .toLowerCase(),

      senha:
        formValue.senha,

      telefone:
        formValue.telefone.trim()
        || null

    };

    this.loading = true;

    this.http
      .post(
        `${environment.apiUrl}/usuarios`,
        request
      )
      .subscribe({

        next: () => {

          this.loading = false;

          this.successMessage =
            'Conta criada com sucesso.';

          setTimeout(() => {

            this.router.navigate([
              '/login'
            ]);

          }, 900);
        },

        error: error => {

          this.loading = false;

          console.error(
            'Erro no cadastro:',
            error
          );

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível criar sua conta.';
        }

      });
  }
}