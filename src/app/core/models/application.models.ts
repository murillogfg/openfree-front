export type StatusCandidatura =
  | 'PENDENTE'
  | 'VISUALIZADA'
  | 'ACEITA'
  | 'RECUSADA';

export interface CreateApplicationRequest {
  mensagem?: string;
  valorProposto?: number;
}

export interface Application {
  id: number;
  usuarioId: number;
  nome: string;
  email: string;
  vagaId: number;
  vagaTitulo: string;
  mensagem: string | null;
  valorProposto: number | null;
  status: StatusCandidatura;
  empresaVisualizou: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MyApplication {

  candidaturaId: number;

  vagaId: number;

  titulo: string;

  empresa: string;

  cidade: string;

  estado: string;

  valor: number;

  dataServico: string;

  status: StatusCandidatura;

  empresaVisualizou: boolean;

  dataCandidatura: string;

}