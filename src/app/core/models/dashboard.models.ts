export interface DashboardFreelancer {
  nomeUsuario: string;
  candidaturasEnviadas: number;
  pendentes: number;
  aceitas: number;
  recusadas: number;
  trabalhosConcluidos: number;
  favoritos: number;
  notificacoesNaoLidas: number;
  conversasAtivas: number;
  mensagensNaoLidas: number;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
}

export interface DashboardEmpresa {
  nomeEmpresa: string;
  vagasPublicadas: number;
  vagasAbertas: number;
  vagasFinalizadas: number;
  candidaturasRecebidas: number;
  candidaturasPendentes: number;
  profissionaisContratados: number;
  conversasAtivas: number;
  mensagensNaoLidas: number;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  taxaContratacao: number;
}