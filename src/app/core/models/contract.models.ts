export type ContractStatus =
  | 'AGUARDANDO_INICIO'
  | 'EM_ANDAMENTO'
  | 'AGUARDANDO_CONFIRMACAO'
  | 'CONCLUIDO'
  | 'CANCELADO'
  | 'EM_DISPUTA';

export interface Contract {
  id: number;

  candidaturaId: number;

  vagaId: number;
  vagaTitulo: string;

  empresaId: number;
  empresaNome: string;

  freelancerId: number;
  freelancerNome: string;

  valor: number;

  status: ContractStatus;

  empresaConfirmouConclusao: boolean;
  freelancerConfirmouConclusao: boolean;

  iniciadoAt: string | null;
  concluidoAt: string | null;

  createdAt: string;
  updatedAt: string;
}