
export interface CreateReviewRequest {
  nota: number;
  comentario?: string;
}

export interface Review {
  id: number;

  candidaturaId: number;

  vagaId: number;
  vagaTitulo: string;

  usuarioAvaliadoId: number;
  usuarioAvaliadoNome: string;

  empresaAvaliadaId: number;
  empresaAvaliadaNome: string;

  tipoAutor: 'FREELANCER' | 'EMPRESA';

  nota: number;
  comentario: string | null;

  createdAt: string;
}

export interface RatingSummary {
  media: number;
  totalAvaliacoes: number;
}