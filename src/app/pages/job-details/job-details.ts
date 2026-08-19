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
import { HttpErrorResponse } from '@angular/common/http';

import { Vaga } from '../../core/models/job.models';
import { JobsService } from '../../core/services/jobs.service';
import { ApplicationsService } from '../../core/services/applications.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './job-details.html',
  styleUrl: './job-details.css'
})
export class JobDetails implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly jobsService = inject(JobsService);
  private readonly applicationsService =
    inject(ApplicationsService);

  job: Vaga | null = null;

  loading = true;
  applying = false;

  errorMessage = '';
  successMessage = '';

  modalOpen = false;

  applicationForm =
    this.formBuilder.nonNullable.group({
      mensagem: [
        '',
        [
          Validators.maxLength(1000)
        ]
      ],

      valorProposto: [
        null as number | null,
        [
          Validators.min(0.01)
        ]
      ]
    });

  ngOnInit(): void {
    this.carregarVaga();
  }

  carregarVaga(): void {
  const id = Number(
    this.route.snapshot.paramMap.get('id')
  );

  if (!Number.isFinite(id) || id <= 0) {
    this.errorMessage = 'Identificador da vaga inválido.';
    this.loading = false;
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.jobsService
    .buscarPorId(id)
    .subscribe({
    next: response => {

  console.log('ANTES');

  this.job = response.data;

  console.log('JOB:', this.job);

  this.loading = false;

  console.log('DEPOIS');
},
      

      complete: () => {
        this.loading = false;
      }
    });
}

  abrirModal(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.modalOpen = true;
  }

 fecharModal(): void {

  if (this.applying) {
    return;
  }

  this.modalOpen = false;
  this.errorMessage = '';

  this.applicationForm.reset();
}

 candidatarSe(): void {

  if (
    !this.job ||
    this.applicationForm.invalid ||
    this.applying
  ) {
    this.applicationForm.markAllAsTouched();
    return;
  }

  this.applying = true;
  this.errorMessage = '';
  this.successMessage = '';

  const formValue =
    this.applicationForm.getRawValue();

  this.applicationsService
    .candidatarSe(
      this.job.id,
      {
        mensagem:
          formValue.mensagem.trim()
          || undefined,

        valorProposto:
          formValue.valorProposto
          ?? undefined
      }
    )
    .subscribe({

      next: response => {

        console.log(
          'Candidatura enviada:',
          response
        );

        this.applying = false;

        this.successMessage =
          'Candidatura enviada com sucesso.';

        this.modalOpen = false;

        this.applicationForm.reset();
      },

      error: (error: HttpErrorResponse) => {

        console.error(
          'Erro ao candidatar-se:',
          error
        );

        // MUITO IMPORTANTE
        this.applying = false;

        this.errorMessage =
          error.error?.message
          ?? 'Não foi possível enviar a candidatura.';
      }
    });
}
}