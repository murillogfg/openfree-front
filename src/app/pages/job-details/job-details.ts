import { CommonModule } from '@angular/common';

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

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  Vaga
} from '../../core/models/job.models';

import {
  JobsService
} from '../../core/services/jobs.service';

import {
  ApplicationsService
} from '../../core/services/applications.service';

import {
  AuthService
} from '../../core/services/auth.service';

import {
  AdService
} from '../../core/services/ad.service';

import {
  AdSlot
} from '../../shared/components/ad-slot/ad-slot';


@Component({
  selector: 'app-job-details',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AdSlot
  ],

  templateUrl: './job-details.html',
  styleUrl: './job-details.css'
})
export class JobDetails implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly jobsService =
    inject(JobsService);

  private readonly applicationsService =
    inject(ApplicationsService);

  private readonly authService =
    inject(AuthService);

  private readonly adService =
    inject(AdService);


  job:
    Vaga | null =
    null;

  loading =
    true;

  applying =
    false;

  errorMessage =
    '';

  successMessage =
    '';

  modalOpen =
    false;


  /*
   * Controla o espaço de anúncio.
   *
   * O anúncio só será exibido depois
   * de uma candidatura concluída
   * com sucesso.
   */
  showAd =
    false;


  applicationForm =
    this.formBuilder
      .nonNullable
      .group({

        mensagem: [
          '',
          [
            Validators.maxLength(
              1000
            )
          ]
        ],

        valorProposto: [
          null as number | null,
          [
            Validators.min(
              0.01
            )
          ]
        ]
      });


  ngOnInit(): void {

    this.carregarVaga();
  }


  carregarVaga(): void {

    const id =
      Number(
        this.route
          .snapshot
          .paramMap
          .get('id')
      );

    if (
      !Number.isFinite(id)
      || id <= 0
    ) {

      this.errorMessage =
        'Identificador da vaga inválido.';

      this.loading =
        false;

      return;
    }


    this.loading =
      true;

    this.errorMessage =
      '';


    this.jobsService
      .buscarPorId(
        id
      )
      .subscribe({

        next: response => {

          this.job =
            response.data;

          this.loading =
            false;
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading =
            false;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível carregar esta vaga.';
        },

        complete: () => {

          this.loading =
            false;
        }
      });
  }


  abrirModal(): void {

    /*
     * A descrição da vaga é pública para SEO,
     * mas candidatar-se continua exigindo conta.
     */
    if (
      !this.authService
        .isAuthenticated()
    ) {

      this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl:
              this.router.url
          }
        }
      );

      return;
    }

    this.successMessage =
      '';

    this.errorMessage =
      '';

    this.modalOpen =
      true;
  }


  fecharModal(): void {

    if (
      this.applying
    ) {
      return;
    }

    this.modalOpen =
      false;

    this.errorMessage =
      '';

    this.applicationForm
      .reset({
        mensagem: '',
        valorProposto: null
      });
  }


  candidatarSe(): void {

    /*
     * Defesa adicional caso o método seja
     * disparado sem passar por abrirModal().
     */
    if (
      !this.authService
        .isAuthenticated()
    ) {

      this.modalOpen =
        false;

      this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl:
              this.router.url
          }
        }
      );

      return;
    }

    if (
      !this.job
      || this.applicationForm.invalid
      || this.applying
    ) {

      this.applicationForm
        .markAllAsTouched();

      return;
    }

    this.applying =
      true;

    this.errorMessage =
      '';

    this.successMessage =
      '';

    const formValue =
      this.applicationForm
        .getRawValue();


    this.applicationsService
      .candidatarSe(
        this.job.id,
        {

          mensagem:
            formValue
              .mensagem
              .trim()
            || undefined,

          valorProposto:
            formValue
              .valorProposto
            ?? undefined
        }
      )
      .subscribe({

        next: () => {

          this.applying =
            false;

          this.successMessage =
            'Candidatura enviada com sucesso.';

          this.modalOpen =
            false;

          this.applicationForm
            .reset({
              mensagem: '',
              valorProposto: null
            });

          /*
           * ==========================================
           * MONETIZAÇÃO LEVE
           * ==========================================
           *
           * Só consideramos exibir anúncio
           * depois de uma candidatura realmente
           * concluída.
           *
           * Se o usuário estiver dentro do
           * cooldown, nada acontece.
           */
          this.verificarAnuncio();
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.applying =
            false;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível enviar a candidatura.';
        }
      });
  }


  /*
   * ==================================================
   * ANÚNCIOS
   * ==================================================
   */
  private verificarAnuncio(): void {

    if (
      !this.adService
        .shouldShowAd()
    ) {
      return;
    }

    /*
     * Registra o anúncio no momento
     * em que decidimos exibi-lo.
     *
     * Assim começa o cooldown
     * de aproximadamente 20 minutos.
     */
    this.adService
      .registerAdShown();

    this.showAd =
      true;
  }


  fecharAnuncio(): void {

    this.showAd =
      false;
  }


  cancelar(): void {

    this.router.navigate([
      '/jobs'
    ]);
  }
}