export interface CreateCompanyRequest {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone?: string;
  descricao?: string;
  logo?: string;
  cidade?: string;
  estado?: string;
  site?: string;
}

export interface Company {
  id: number;

  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;

  email: string;
  telefone: string | null;

  descricao: string | null;
  logo: string | null;

  verificada: boolean;
  ativa: boolean;

  cidade: string | null;
  estado: string | null;
  site: string | null;

  createdAt: string;
  updatedAt: string;


}