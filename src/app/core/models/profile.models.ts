export interface FreelancerProfile {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  role: 'FREELANCER' | 'EMPRESA';

  tituloProfissional: string | null;
  biografia: string | null;
  cidade: string | null;
  estado: string | null;
  habilidades: string | null;

  avatarUrl: string | null;
  curriculoUrl: string | null;
  portfolioUrl: string | null;
}

export interface UpdateFreelancerProfile {
  nome?: string;
  telefone?: string;
  tituloProfissional?: string;
  biografia?: string;
  cidade?: string;
  estado?: string;
  habilidades?: string;
  portfolioUrl?: string;
}

export interface CompanyProfile {
  id: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;

  telefone: string | null;
  descricao: string | null;
  logo: string | null;

  cidade: string | null;
  estado: string | null;
  site: string | null;

  verificada: boolean;
  ativa: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateCompanyProfile {
  nomeFantasia?: string;
  telefone?: string;
  descricao?: string;
  cidade?: string;
  estado?: string;
  site?: string;
}

export interface UploadResponse {
  fileName: string;
  url: string;
  contentType: string;
  size: number;
}