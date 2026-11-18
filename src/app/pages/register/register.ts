import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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

type Perfil = 'FREELANCER' | 'CONTRATANTE';
type TipoPessoa = 'PF' | 'PJ';

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
export class Register implements OnInit {

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly http =
    inject(HttpClient);

  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  loading = false;

  errorMessage = '';
  successMessage = '';

  /*
   * Lado escolhido no cadastro.
   * A landing page já manda ?perfil=contratante
   * ou ?perfil=freelancer.
   */
  perfil: Perfil = 'FREELANCER';

  tipoPessoa: TipoPessoa = 'PF';

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

      cpf: [
        ''
      ],

      cnpj: [
        ''
      ],

      nomeEmpresa: [
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
      ],

      aceitouTermos: [
        false,
        [
          Validators.requiredTrue
        ]
      ]

    });

  ngOnInit(): void {

    const perfilUrl =
      this.route
        .snapshot
        .queryParamMap
        .get('perfil');

    if (perfilUrl === 'contratante') {
      this.escolherPerfil('CONTRATANTE');
    }
  }

  get contratante(): boolean {
    return this.perfil === 'CONTRATANTE';
  }

  escolherPerfil(perfil: Perfil): void {

    this.perfil = perfil;
    this.errorMessage = '';

    this.atualizarValidadores();
  }

  escolherTipoPessoa(tipo: TipoPessoa): void {

    this.tipoPessoa = tipo;
    this.errorMessage = '';

    this.atualizarValidadores();
  }

  /*
   * CPF só é obrigatório para contratante PF;
   * CNPJ e nome da empresa só para contratante PJ.
   */
  private atualizarValidadores(): void {

    const { cpf, cnpj, nomeEmpresa } =
      this.registerForm.controls;

    cpf.clearValidators();
    cnpj.clearValidators();
    nomeEmpresa.clearValidators();

    if (this.contratante && this.tipoPessoa === 'PF') {
      cpf.setValidators([
        Validators.required,
        Validators.pattern(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)
      ]);
    }

    if (this.contratante && this.tipoPessoa === 'PJ') {
      cnpj.setValidators([
        Validators.required,
        Validators.pattern(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/)
      ]);
      nomeEmpresa.setValidators([
        Validators.required,
        Validators.maxLength(120)
      ]);
    }

    cpf.updateValueAndValidity();
    cnpj.updateValueAndValidity();
    nomeEmpresa.updateValueAndValidity();
  }

  submit(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (
      this.registerForm.invalid
      || this.loading
    ) {

      this.registerForm.markAllAsTouched();

      this.errorMessage =
        'Preencha os campos obrigatórios e aceite os Termos de Uso e a Política de Privacidade.';

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

    const somenteNumeros =
      (valor: string) => valor.replace(/\D/g, '');

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
        || null,

      aceitouTermos:
        formValue.aceitouTermos,

      perfil:
        this.perfil,

      /*
       * Campos não usados vão como null (e não "")
       * para não esbarrar na validação da API.
       */
      contratante:
        this.contratante
          ? {
              tipoPessoa:
                this.tipoPessoa,

              cpf:
                this.tipoPessoa === 'PF'
                  ? somenteNumeros(formValue.cpf)
                  : null,

              cnpj:
                this.tipoPessoa === 'PJ'
                  ? somenteNumeros(formValue.cnpj)
                  : null,

              nomeFantasia:
                this.tipoPessoa === 'PJ'
                  ? formValue.nomeEmpresa.trim()
                  : null
            }
          : null
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
