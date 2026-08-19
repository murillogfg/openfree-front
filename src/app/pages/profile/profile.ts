import { CommonModule } from '@angular/common';

import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { UploadService } from '../../core/services/upload.service';

import {
  CompanyProfile,
  FreelancerProfile
} from '../../core/models/profile.models';

@Component({
  selector: 'app-profile',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  private readonly authService =
    inject(AuthService);

  private readonly profileService =
    inject(ProfileService);

  private readonly uploadService =
    inject(UploadService);

  private readonly formBuilder =
    inject(FormBuilder);

  freelancer: FreelancerProfile | null = null;
  company: CompanyProfile | null = null;

  loading = true;
  saving = false;
  uploading = false;

  successMessage = '';
  errorMessage = '';

  readonly apiUrl =
    environment.apiUrl;

  freelancerForm =
    this.formBuilder.nonNullable.group({

      nome: [''],

      telefone: [''],

      tituloProfissional: [''],

      biografia: [''],

      cidade: [''],

      estado: [''],

      habilidades: [''],

      portfolioUrl: ['']
    });

  companyForm =
    this.formBuilder.nonNullable.group({

      nomeFantasia: [''],

      telefone: [''],

      descricao: [''],

      cidade: [''],

      estado: [''],

      site: ['']
    });

  ngOnInit(): void {
    this.carregarPerfil();
  }

  get isCompany(): boolean {
    return this.authService.isCompany();
  }

  get isFreelancer(): boolean {
    return this.authService.isFreelancer();
  }

  get avatarUrl(): string | null {

    const url =
      this.isCompany
        ? this.company?.logo
        : this.freelancer?.avatarUrl;

    if (!url) {
      return null;
    }

    if (url.startsWith('http')) {
      return url;
    }

    return `${this.apiUrl}${url}`;
  }

  carregarPerfil(): void {

    this.loading = true;
    this.errorMessage = '';

    if (this.isCompany) {
      this.carregarEmpresa();
    } else {
      this.carregarFreelancer();
    }
  }

  private carregarFreelancer(): void {

    this.profileService
      .getFreelancerProfile()
      .subscribe({

        next: response => {

          this.freelancer =
            response.data;

          this.freelancerForm.patchValue({

            nome:
              response.data.nome ?? '',

            telefone:
              response.data.telefone ?? '',

            tituloProfissional:
              response.data.tituloProfissional ?? '',

            biografia:
              response.data.biografia ?? '',

            cidade:
              response.data.cidade ?? '',

            estado:
              response.data.estado ?? '',

            habilidades:
              response.data.habilidades ?? '',

            portfolioUrl:
              response.data.portfolioUrl ?? ''
          });

          this.loading = false;
        },

        error: error => {

          this.tratarErro(
            error,
            'Não foi possível carregar seu perfil.'
          );
        }
      });
  }

  private carregarEmpresa(): void {

    this.profileService
      .getCompanyProfile()
      .subscribe({

        next: response => {

          this.company =
            response.data;

          this.companyForm.patchValue({

            nomeFantasia:
              response.data.nomeFantasia ?? '',

            telefone:
              response.data.telefone ?? '',

            descricao:
              response.data.descricao ?? '',

            cidade:
              response.data.cidade ?? '',

            estado:
              response.data.estado ?? '',

            site:
              response.data.site ?? ''
          });

          this.loading = false;
        },

        error: error => {

          this.tratarErro(
            error,
            'Não foi possível carregar a empresa.'
          );
        }
      });
  }

  salvar(): void {

    if (this.saving) {
      return;
    }

    this.saving = true;

    this.successMessage = '';
    this.errorMessage = '';

    if (this.isCompany) {
      this.salvarEmpresa();
    } else {
      this.salvarFreelancer();
    }
  }

  private salvarFreelancer(): void {

    this.profileService
      .updateFreelancerProfile(
        this.freelancerForm.getRawValue()
      )
      .subscribe({

        next: response => {

          this.freelancer =
            response.data;

          this.saving = false;

          this.successMessage =
            'Perfil atualizado com sucesso.';
        },

        error: error => {

          this.saving = false;

          this.tratarErro(
            error,
            'Não foi possível atualizar seu perfil.'
          );
        }
      });
  }

  private salvarEmpresa(): void {

    this.profileService
      .updateCompanyProfile(
        this.companyForm.getRawValue()
      )
      .subscribe({

        next: response => {

          this.company =
            response.data;

          this.saving = false;

          this.successMessage =
            'Perfil empresarial atualizado com sucesso.';
        },

        error: error => {

          this.saving = false;

          this.tratarErro(
            error,
            'Não foi possível atualizar a empresa.'
          );
        }
      });
  }

  selecionarAvatar(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    this.uploading = true;
    this.errorMessage = '';

    const upload$ =
      this.isCompany
        ? this.uploadService.uploadCompanyLogo(file)
        : this.uploadService.uploadAvatar(file);

    upload$.subscribe({

      next: response => {

        if (
          this.isCompany
          && this.company
        ) {

          this.company.logo =
            response.data.url;
        }

        if (
          !this.isCompany
          && this.freelancer
        ) {

          this.freelancer.avatarUrl =
            response.data.url;
        }

        this.uploading = false;

        this.successMessage =
          this.isCompany
            ? 'Logo atualizado com sucesso.'
            : 'Foto atualizada com sucesso.';
      },

      error: error => {

        this.uploading = false;

        this.tratarErro(
          error,
          'Não foi possível enviar a imagem.'
        );
      }
    });
  }

  selecionarCurriculo(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    this.uploading = true;
    this.errorMessage = '';

    this.uploadService
      .uploadCurriculum(file)
      .subscribe({

        next: response => {

          if (this.freelancer) {

            this.freelancer.curriculoUrl =
              response.data.url;
          }

          this.uploading = false;

          this.successMessage =
            'Currículo enviado com sucesso.';
        },

        error: error => {

          this.uploading = false;

          this.tratarErro(
            error,
            'Não foi possível enviar o currículo.'
          );
        }
      });
  }

  private tratarErro(
    error: HttpErrorResponse,
    fallback: string
  ): void {

    this.loading = false;

    this.errorMessage =
      error.error?.message
      ?? fallback;
  }
}