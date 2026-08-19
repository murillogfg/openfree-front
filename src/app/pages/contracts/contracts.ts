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

import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../core/services/auth.service';
import { ContractsService } from '../../core/services/contracts.service';
import { ReviewsService } from '../../core/services/reviews.service';

import {
  Contract,
  ContractStatus
} from '../../core/models/contract.models';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './contracts.html',
  styleUrl: './contracts.css'
})
export class Contracts implements OnInit {

  private readonly authService =
    inject(AuthService);

  private readonly contractsService =
    inject(ContractsService);

  private readonly reviewsService =
    inject(ReviewsService);

  private readonly formBuilder =
    inject(FormBuilder);

  contracts: Contract[] = [];

  loading = true;
  processingId: number | null = null;

  errorMessage = '';
  successMessage = '';

  filtro: ContractStatus | 'TODOS' = 'TODOS';

  reviewModalOpen = false;
  contractToReview: Contract | null = null;

  reviewForm =
    this.formBuilder.nonNullable.group({
      nota: [
        5,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(5)
        ]
      ],

      comentario: [
        '',
        [
          Validators.maxLength(1500)
        ]
      ]
    });

  ngOnInit(): void {
    this.carregar();
  }

  get isCompany(): boolean {
    return this.authService.isCompany();
  }

  get contractsFiltrados(): Contract[] {

    if (this.filtro === 'TODOS') {
      return this.contracts;
    }

    return this.contracts.filter(
      contract =>
        contract.status === this.filtro
    );
  }

  carregar(): void {

    this.loading = true;
    this.errorMessage = '';

    const request$ =
      this.isCompany
        ? this.contractsService.listarContratosEmpresa()
        : this.contractsService.listarMeusContratos();

    request$.subscribe({

      next: response => {
        this.contracts =
          response.data ?? [];

        this.loading = false;
      },

      error: (error: HttpErrorResponse) => {

        this.loading = false;

        this.errorMessage =
          error.error?.message
          ?? 'Não foi possível carregar os contratos.';
      }
    });
  }

  definirFiltro(
    filtro: ContractStatus | 'TODOS'
  ): void {

    this.filtro = filtro;
  }

  iniciar(
    contract: Contract
  ): void {

    if (
      !this.isCompany
      || this.processingId !== null
    ) {
      return;
    }

    this.processingId = contract.id;

    this.errorMessage = '';
    this.successMessage = '';

    this.contractsService
      .iniciar(contract.id)
      .subscribe({

        next: response => {

          this.atualizarContrato(
            response.data
          );

          this.processingId = null;

          this.successMessage =
            'Serviço iniciado com sucesso.';
        },

        error: (error: HttpErrorResponse) => {

          this.processingId = null;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível iniciar o contrato.';
        }
      });
  }

  confirmarConclusao(
    contract: Contract
  ): void {

    if (this.processingId !== null) {
      return;
    }

    this.processingId = contract.id;

    this.errorMessage = '';
    this.successMessage = '';

    const request$ =
      this.isCompany
        ? this.contractsService
            .confirmarConclusaoEmpresa(contract.id)
        : this.contractsService
            .confirmarConclusaoFreelancer(contract.id);

    request$.subscribe({

      next: response => {

        this.atualizarContrato(
          response.data
        );

        this.processingId = null;

        this.successMessage =
          'Conclusão confirmada com sucesso.';
      },

      error: (error: HttpErrorResponse) => {

        this.processingId = null;

        this.errorMessage =
          error.error?.message
          ?? 'Não foi possível confirmar a conclusão.';
      }
    });
  }

  abrirAvaliacao(
    contract: Contract
  ): void {

    this.contractToReview = contract;

    this.reviewForm.reset({
      nota: 5,
      comentario: ''
    });

    this.reviewModalOpen = true;

    this.errorMessage = '';
  }

  fecharAvaliacao(): void {

    if (this.processingId !== null) {
      return;
    }

    this.reviewModalOpen = false;
    this.contractToReview = null;
  }

  enviarAvaliacao(): void {

    if (
      !this.contractToReview
      || this.reviewForm.invalid
      || this.processingId !== null
    ) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const contract =
      this.contractToReview;

    const formValue =
      this.reviewForm.getRawValue();

    this.processingId = contract.id;

    const request = {
      nota: formValue.nota,
      comentario:
        formValue.comentario.trim()
        || undefined
    };

    const request$ =
      this.isCompany
        ? this.reviewsService.avaliarFreelancer(
            contract.candidaturaId,
            request
          )
        : this.reviewsService.avaliarEmpresa(
            contract.candidaturaId,
            request
          );

    request$.subscribe({

      next: () => {

        this.processingId = null;
        this.reviewModalOpen = false;
        this.contractToReview = null;

        this.successMessage =
          'Avaliação enviada com sucesso.';
      },

      error: (error: HttpErrorResponse) => {

        this.processingId = null;

        this.errorMessage =
          error.error?.message
          ?? 'Não foi possível enviar a avaliação.';
      }
    });
  }

  jaConfirmou(
    contract: Contract
  ): boolean {

    return this.isCompany
      ? contract.empresaConfirmouConclusao
      : contract.freelancerConfirmouConclusao;
  }

  statusLabel(
    status: ContractStatus
  ): string {

    switch (status) {

      case 'AGUARDANDO_INICIO':
        return 'Aguardando início';

      case 'EM_ANDAMENTO':
        return 'Em andamento';

      case 'AGUARDANDO_CONFIRMACAO':
        return 'Aguardando confirmação';

      case 'CONCLUIDO':
        return 'Concluído';

      case 'CANCELADO':
        return 'Cancelado';

      case 'EM_DISPUTA':
        return 'Em disputa';

      default:
        return status;
    }
  }

  private atualizarContrato(
    atualizado: Contract
  ): void {

    this.contracts =
      this.contracts.map(
        contract =>
          contract.id === atualizado.id
            ? atualizado
            : contract
      );
  }
}