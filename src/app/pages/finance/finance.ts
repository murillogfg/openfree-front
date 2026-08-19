import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { PaymentsService } from '../../core/services/payments.service';

import {
  Payment,
  PaymentMethod,
  PaymentStatus
} from '../../core/models/payment.models';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './finance.html',
  styleUrl: './finance.css'
})
export class Finance implements OnInit {

  private readonly paymentsService =
    inject(PaymentsService);

  payments: Payment[] = [];

  loading = true;

  processingId: number | null = null;

  errorMessage = '';
  successMessage = '';

  filtro: PaymentStatus | 'TODOS' = 'TODOS';

  selectedMethods: Record<number, PaymentMethod> = {};

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {

    this.loading = true;
    this.errorMessage = '';

    this.paymentsService
      .listarPagamentosEmpresa()
      .subscribe({

        next: response => {

          this.payments =
            response.data ?? [];

          for (const payment of this.payments) {

            if (!this.selectedMethods[payment.id]) {
              this.selectedMethods[payment.id] = 'PIX';
            }
          }

          this.loading = false;
        },

        error: (error: HttpErrorResponse) => {

          this.loading = false;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível carregar o financeiro.';
        }
      });
  }

  get paymentsFiltrados(): Payment[] {

    if (this.filtro === 'TODOS') {
      return this.payments;
    }

    return this.payments.filter(
      payment =>
        payment.status === this.filtro
    );
  }

  definirFiltro(
    filtro: PaymentStatus | 'TODOS'
  ): void {

    this.filtro = filtro;
  }

  alterarMetodo(
    paymentId: number,
    event: Event
  ): void {

    const select =
      event.target as HTMLSelectElement;

    this.selectedMethods[paymentId] =
      select.value as PaymentMethod;
  }

  pagar(
    payment: Payment
  ): void {

    if (this.processingId !== null) {
      return;
    }

    this.processingId = payment.id;

    this.errorMessage = '';
    this.successMessage = '';

    const metodo =
      this.selectedMethods[payment.id]
      ?? 'PIX';

    this.paymentsService
      .simularPagamento(
        payment.id,
        metodo
      )
      .subscribe({

        next: response => {

          this.atualizarPayment(
            response.data
          );

          this.successMessage =
            'Pagamento confirmado e protegido com sucesso.';

          this.processingId = null;
        },

        error: (error: HttpErrorResponse) => {

          this.processingId = null;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível confirmar o pagamento.';
        }
      });
  }

  liberar(
    payment: Payment
  ): void {

    if (this.processingId !== null) {
      return;
    }

    this.processingId = payment.id;

    this.errorMessage = '';
    this.successMessage = '';

    this.paymentsService
      .liberarPagamento(
        payment.id
      )
      .subscribe({

        next: response => {

          this.atualizarPayment(
            response.data
          );

          this.successMessage =
            'Pagamento liberado ao profissional com sucesso.';

          this.processingId = null;
        },

        error: (error: HttpErrorResponse) => {

          this.processingId = null;

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível liberar o pagamento.';
        }
      });
  }

  private atualizarPayment(
    atualizado: Payment
  ): void {

    this.payments =
      this.payments.map(
        payment =>
          payment.id === atualizado.id
            ? atualizado
            : payment
      );
  }

  get aguardandoPagamento(): number {

    return this.somarPorStatus(
      'AGUARDANDO_PAGAMENTO'
    );
  }

  get protegido(): number {

    return this.somarPorStatus(
      'RETIDO'
    );
  }

  get liberado(): number {

    return this.somarPorStatus(
      'LIBERADO'
    );
  }

  private somarPorStatus(
    status: PaymentStatus
  ): number {

    return this.payments
      .filter(
        payment =>
          payment.status === status
      )
      .reduce(
        (total, payment) =>
          total + payment.valorBruto,
        0
      );
  }
}