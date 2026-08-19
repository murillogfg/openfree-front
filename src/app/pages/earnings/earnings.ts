import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PaymentsService } from '../../core/services/payments.service';
import {
  Payment,
  PaymentStatus
} from '../../core/models/payment.models';

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './earnings.html',
  styleUrl: './earnings.css'
})
export class Earnings implements OnInit {

  private readonly paymentsService =
    inject(PaymentsService);

  payments: Payment[] = [];

  loading = true;
  errorMessage = '';

  filtro: PaymentStatus | 'TODOS' = 'TODOS';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {

    this.loading = true;
    this.errorMessage = '';

    this.paymentsService
      .listarMeusPagamentos()
      .subscribe({

        next: response => {
          this.payments = response.data ?? [];
        },

        error: error => {

          console.error(
            'Erro ao carregar pagamentos:',
            error
          );

          this.errorMessage =
            error.error?.message
            ?? 'Não foi possível carregar seus ganhos.';

          this.loading = false;
        },

        complete: () => {
          this.loading = false;
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

  get totalRecebido(): number {

    return this.payments
      .filter(
        payment =>
          payment.status === 'LIBERADO'
      )
      .reduce(
        (total, payment) =>
          total + payment.valorLiquido,
        0
      );
  }

  get aguardandoLiberacao(): number {

    return this.payments
      .filter(
        payment =>
          payment.status === 'RETIDO'
      )
      .reduce(
        (total, payment) =>
          total + payment.valorLiquido,
        0
      );
  }

  get aReceber(): number {

    return this.payments
      .filter(
        payment =>
          payment.status ===
          'AGUARDANDO_PAGAMENTO'
      )
      .reduce(
        (total, payment) =>
          total + payment.valorLiquido,
        0
      );
  }
}