export type FavoriteJobStatus =
  | 'RASCUNHO'
  | 'PUBLICADA'
  | 'FINALIZADA'
  | 'CANCELADA';

export interface Favorite {
  id: number;

  vagaId: number;

  titulo: string;
  empresaNome: string;

  cidade: string;
  estado: string;

  valor: number;

  dataServico: string;

  status: FavoriteJobStatus;

  favoritadoEm: string;
}