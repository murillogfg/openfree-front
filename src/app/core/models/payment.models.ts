export type PaymentStatus =
  | 'PENDENTE'
  | 'AGUARDANDO_PAGAMENTO'
  | 'RETIDO'
  | 'LIBERADO'
  | 'CANCELADO'
  | 'ESTORNADO';

export type PaymentMethod =
  | 'PIX'
  | 'CARTAO'
  | 'BOLETO'
  | 'SALDO';

export interface Payment {
  id: number;

  candidaturaId: number;
  vagaId: number;
  vagaTitulo: string;

  empresaId: number;
  empresaNome: string;

  freelancerId: number;
  freelancerNome: string;

  valorBruto: number;
  taxaPlataforma: number;
  valorLiquido: number;

  status: PaymentStatus;
  metodo: PaymentMethod | null;

  externalId: string | null;

  pagoEm: string | null;
  liberadoEm: string | null;

  createdAt: string;
  updatedAt: string;
}