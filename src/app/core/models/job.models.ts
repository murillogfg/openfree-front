export type StatusVaga =
  | 'RASCUNHO'
  | 'PUBLICADA'
  | 'EM_ANDAMENTO'
  | 'FINALIZADA'
  | 'CANCELADA'
  | 'ARQUIVADA';

export interface Vaga {
  id: number;
  empresaId: number;
  empresaNome: string;
  titulo: string;
  descricao: string;
  requisitos: string;
  cidade: string;
  estado: string;
  valor: number;
  quantidadePessoas: number;
  dataServico: string;
  horarioInicio: string;
  horarioFim: string;
  status: StatusVaga;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilter {
  titulo?: string;
  cidade?: string;
  estado?: string;
  status?: StatusVaga;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}