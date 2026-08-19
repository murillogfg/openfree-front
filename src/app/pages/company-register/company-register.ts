import { CommonModule } from '@angular/common';

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

import { HttpErrorResponse } from '@angular/common/http';

import { CompaniesService } from '../../core/services/companies.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-company-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './company-register.html',
  styleUrl: './company-register.css'
})
export class CompanyRegister {

  private readonly fb =
    inject(FormBuilder);

  private readonly companiesService =
    inject(CompaniesService);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  loading = false;

  errorMessage = '';

  form =
    this.fb.nonNullable.group({

      razaoSocial: [
        '',
        [
          Validators.required,
          Validators.maxLength(150)
        ]
      ],

      nomeFantasia: [
        '',
        [
          Validators.required,
          Validators.maxLength(120)
        ]
      ],

      cnpj: [
        '',
        [
          Validators.required
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(150)
        ]
      ],

      telefone: [
        '',
        [
          Validators.maxLength(20)
        ]
      ],
    
      cidade: [
  '',
  [
    Validators.maxLength(100)
  ]
],

estado: [
  '',
  [
    Validators.maxLength(2)
  ]
],

site: [
  '',
  [
    Validators.maxLength(255)
  ]
]
,

      descricao: [
        '',
        [
          Validators.maxLength(2000)
        ]
      ],

      logo: [
        '',
        [
          Validators.maxLength(500)
        ]
      ]

    });

    

  submit(): void {

    this.errorMessage = '';

    if (
      this.form.invalid
      || this.loading
    ) {

      this.form.markAllAsTouched();
      return;
    }

    const value =
      this.form.getRawValue();

    const request = {

      razaoSocial:
        value.razaoSocial.trim(),

      nomeFantasia:
        value.nomeFantasia.trim(),

      cnpj:
        value.cnpj.trim(),

      email:
        value.email
          .trim()
          .toLowerCase(),

      telefone:
        value.telefone.trim()
        || undefined,

      descricao:
        value.descricao.trim()
        || undefined,

      logo:
        value.logo.trim()
        || undefined
,
        cidade:
  value.cidade.trim()
  || undefined,

estado:
  value.estado
    .trim()
    .toUpperCase()
  || undefined,

site:
  value.site.trim()
  || undefined,
    };

    this.loading = true;

    this.companiesService
      .criar(request)
      .subscribe({

        next: response => {

          console.log(
            'Empresa criada:',
            response.data
          );

          /*
           * O usuário agora é EMPRESA no banco,
           * mas o JWT atual pode ainda possuir
           * role FREELANCER.
           *
           * Fazemos novo login para receber
           * um token atualizado.
           */
          this.authService.logout();

          this.router.navigate(
            ['/login'],
            {
              queryParams: {
                companyCreated: 'true'
              }
            }
          );
        },

        error: (error: HttpErrorResponse) => {

          this.loading = false;

          console.error(
            'Erro ao criar empresa:',
            error
          );

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível criar a empresa.';
        }

      });
  }

  cancelar(): void {
    this.router.navigate([
      '/profile'
    ]);
  }
}